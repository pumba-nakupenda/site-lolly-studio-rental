import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

const SUBJECT_MAP: Record<string, string> = {
  general: 'Nouveau contact',
  project: 'Demande de projet',
  equipment_quote: 'Demande de devis équipement',
  studio_booking: 'Réservation studio',
  training: 'Réservation salle formation',
  academy_registration: 'Demande LOLLY Academy',
};

const ALLOWED_TYPES = new Set(Object.keys(SUBJECT_MAP));
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function escapeHtml(value: unknown) {
  return clean(value, 2000)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function requestDetailsHtml(requestType: string, details: Record<string, unknown>) {
  if (requestType === 'academy_registration') {
    return `<p><strong>Offre :</strong> ${escapeHtml(details.offer_name)}</p><p><strong>Entreprise :</strong> ${escapeHtml(details.company) || 'Non précisée'}</p>`;
  }
  if (requestType === 'studio_booking') {
    return `<p><strong>Studio :</strong> ${escapeHtml(details.studio)}</p><p><strong>Date :</strong> ${escapeHtml(details.date)} — ${escapeHtml(details.duration)}</p>${details.needs ? `<p><strong>Besoins :</strong> ${escapeHtml(details.needs)}</p>` : ''}`;
  }
  if (requestType === 'training') {
    return `<p><strong>Salle :</strong> ${escapeHtml(details.room)}</p><p><strong>Date :</strong> ${escapeHtml(details.date)} — ${escapeHtml(details.duration)}</p><p><strong>Participants :</strong> ${escapeHtml(details.participants)}</p>${details.topic ? `<p><strong>Sujet :</strong> ${escapeHtml(details.topic)}</p>` : ''}`;
  }
  if (requestType === 'equipment_quote' && Array.isArray(details.items)) {
    const items = details.items.slice(0, 30).map((item) => {
      const equipment = item && typeof item === 'object' ? item as Record<string, unknown> : {};
      return `<li>${escapeHtml(equipment.brand)} ${escapeHtml(equipment.name)} — ${escapeHtml(equipment.price)}</li>`;
    }).join('');
    return `<h3>Équipements demandés :</h3><ul>${items}</ul>${details.dates ? `<p><strong>Dates :</strong> ${escapeHtml(details.dates)}</p>` : ''}`;
  }
  return '';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (clean(body.website, 200)) return Response.json({ success: true });

    const name = clean(body.name, 160);
    const email = clean(body.email, 160).toLowerCase();
    const phone = clean(body.phone, 40);
    const serviceInterest = clean(body.service_interest, 180);
    const message = clean(body.message, 2000);
    const requestType = ALLOWED_TYPES.has(body.request_type) ? body.request_type : 'general';
    const requestData = body.request_data && typeof body.request_data === 'object' && !Array.isArray(body.request_data) ? body.request_data : {};

    if (!name || !EMAIL_PATTERN.test(email)) {
      return Response.json({ error: 'Indique un nom et une adresse e-mail valides.' }, { status: 400 });
    }

    const supabase = await createClient();
    const { error: dbError } = await supabase.from('contact_requests').insert({
      name,
      email,
      phone,
      service_interest: serviceInterest,
      message,
      request_type: requestType,
      request_data: requestData,
    });

    if (dbError) {
      console.error('Supabase insert error:', dbError);
      return Response.json({ error: 'Impossible d’enregistrer la demande pour le moment.' }, { status: 500 });
    }

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const details = requestData as Record<string, unknown>;
      const detailsHtml = requestDetailsHtml(requestType, details);

      await resend.emails.send({
        from: 'LOLLY Site <onboarding@resend.dev>',
        to: ['contact@lolly.sn'],
        subject: `${SUBJECT_MAP[requestType]} : ${name} — ${serviceInterest}`,
        html: `<div style="font-family:sans-serif;max-width:600px">
          <h2 style="color:#6f5900;margin:0 0 16px">${SUBJECT_MAP[requestType]}</h2>
          <p><strong>${escapeHtml(name)}</strong> (${escapeHtml(email)}${phone ? `, ${escapeHtml(phone)}` : ''})</p>
          <p><strong>Service :</strong> ${escapeHtml(serviceInterest)}</p>
          ${detailsHtml}
          ${message ? `<p style="margin-top:16px;padding:12px;background:#f5f5f5">${escapeHtml(message)}</p>` : ''}
        </div>`,
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Contact route error:', error);
    return Response.json({ error: 'Une erreur est survenue.' }, { status: 500 });
  }
}
