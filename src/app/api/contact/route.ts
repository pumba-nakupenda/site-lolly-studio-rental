import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const SUBJECT_MAP: Record<string, string> = {
  general: "Nouveau contact",
  project: "Demande de projet",
  equipment_quote: "Demande de devis équipement",
  studio_booking: "Réservation studio",
  training: "Réservation salle formation",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      service_interest,
      message,
      request_type = "general",
      request_data = {},
    } = body;

    // Validate required fields
    if (!name || !email) {
      return Response.json(
        { error: "Les champs nom et email sont requis." },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const supabase = await createClient();
    const { error: dbError } = await supabase
      .from("contact_requests")
      .insert({
        name,
        email,
        phone,
        service_interest,
        message,
        request_type,
        request_data,
      });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return Response.json(
        { error: "Erreur lors de l'enregistrement." },
        { status: 500 }
      );
    }

    // Send notification email via Resend
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const subject = `${SUBJECT_MAP[request_type] || "Nouveau contact"}: ${name} — ${service_interest}`;

      await resend.emails.send({
        from: "LOLLY Site <onboarding@resend.dev>",
        to: ["contact@lolly.sn"],
        subject,
        html: `
          <div style="font-family:sans-serif;max-width:600px">
            <h2 style="color:#FFD100;margin:0 0 16px">${SUBJECT_MAP[request_type] || "Nouveau contact"}</h2>
            <p><strong>${name}</strong> (${email}${phone ? ", " + phone : ""})</p>
            <p>Service: ${service_interest}</p>
            ${request_type === "equipment_quote" && request_data.items ? `
              <h3>Équipements demandés:</h3>
              <ul>${request_data.items.map((i: { brand: string; name: string; price: string }) => `<li>${i.brand} ${i.name} — ${i.price}</li>`).join("")}</ul>
              ${request_data.dates ? `<p>Dates: ${request_data.dates}</p>` : ""}
            ` : ""}
            ${request_type === "studio_booking" ? `
              <p>Studio: ${request_data.studio}</p>
              <p>Date: ${request_data.date} — ${request_data.duration}</p>
              ${request_data.needs ? `<p>Besoins: ${request_data.needs}</p>` : ""}
            ` : ""}
            ${request_type === "training" ? `
              <p>Salle: ${request_data.room}</p>
              <p>Date: ${request_data.date} — ${request_data.duration}</p>
              <p>Participants: ${request_data.participants}</p>
              ${request_data.topic ? `<p>Sujet: ${request_data.topic}</p>` : ""}
            ` : ""}
            ${message ? `<p style="margin-top:16px;padding:12px;background:#f5f5f5">${message}</p>` : ""}
          </div>
        `,
      });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return Response.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}
