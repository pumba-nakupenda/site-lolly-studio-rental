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
const ACADEMY_OFFER_NAMES: Record<string, string> = {
  conseil: 'Échange conseil après diagnostic',
  masterclass: 'Les Masterclass de LOLLY',
  'formation-intensive': 'Formation intensive',
  accompagnement: 'Accompagnement',
  ateliers: 'Ateliers LOLLY',
};
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
    const eventDetails = details.offer === 'masterclass' || details.offer === 'ateliers' ? `<p><strong>Sujet souhaité :</strong> ${escapeHtml(details.topic) || 'Prochain thème'}</p>${details.offer === 'masterclass' ? `<p><strong>Samedi souhaité :</strong> ${escapeHtml(details.session_preference) || 'Prochaine date à communiquer'}</p>` : ''}` : '';
    return `<p><strong>Rendez-vous ou offre :</strong> ${escapeHtml(details.offer_name)}</p>${eventDetails}<p><strong>Entreprise :</strong> ${escapeHtml(details.company) || 'Non précisée'}</p>`;
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
    let serviceInterest = clean(body.service_interest, 180);
    const message = clean(body.message, 2000);
    const requestType = ALLOWED_TYPES.has(body.request_type) ? body.request_type : 'general';
    let requestData: Record<string, unknown> = body.request_data && typeof body.request_data === 'object' && !Array.isArray(body.request_data) ? body.request_data : {};

    if (!name || !EMAIL_PATTERN.test(email)) {
      return Response.json({ error: 'Indique un nom et une adresse e-mail valides.' }, { status: 400 });
    }

    if (requestType === 'academy_registration') {
      const offer = clean(requestData.offer, 40);
      if (!ACADEMY_OFFER_NAMES[offer]) {
        return Response.json({ error: 'Choisis une offre Academy valide.' }, { status: 400 });
      }
      const sessionPreference = offer === 'masterclass' ? clean(requestData.session_preference, 10) : '';
      if (sessionPreference) {
        const sessionDate = new Date(`${sessionPreference}T00:00:00Z`);
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(sessionPreference) || Number.isNaN(sessionDate.getTime()) || sessionDate.toISOString().slice(0, 10) !== sessionPreference || sessionDate.getUTCDay() !== 6 || sessionDate < today) {
          return Response.json({ error: 'Choisis un samedi à venir.' }, { status: 400 });
        }
      }
      requestData = {
        offer,
        offer_name: ACADEMY_OFFER_NAMES[offer],
        company: clean(requestData.company, 120),
        topic: clean(requestData.topic, 160),
        session_preference: sessionPreference,
      };
      serviceInterest = `LOLLY Academy — ${ACADEMY_OFFER_NAMES[offer]}`;
    }

    const supabase = await createClient();
    const { error: dbError } = await supabase.from('contact_requests').insert({
      name,
      email,
      phone,
      service_interest: serviceInterest,
      message,
      // La contrainte actuelle de contact_requests n'accepte pas encore academy_registration.
      // Le type métier Academy reste dans request_data et service_interest jusqu'à migration validée.
      request_type: requestType === 'academy_registration' ? 'general' : requestType,
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
