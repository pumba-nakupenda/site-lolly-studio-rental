import Logo from './Logo';
import { CONTACT } from '../_lib/offers';

export default function Footer() {
  return (
    <footer
      style={{
        background: '#0A0A0A',
        color: '#E8E8E8',
        padding: '64px 24px 40px',
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          display: 'grid',
          gap: 32,
          gridTemplateColumns: 'minmax(240px, 1fr) minmax(180px, 1fr) minmax(180px, 1fr)',
        }}
        className="academy-body"
      >
        <div>
          <Logo light large />
          <p style={{ marginTop: 16, color: '#9A9A9A', maxWidth: 320, fontSize: 14, lineHeight: 1.55 }}>
            L’académie en ligne de LOLLY Communication. 4 chemins pour faire bouger ta com — chacun adapté à un profil et un moment.
          </p>
        </div>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', color: '#FED700', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>
            Contact
          </p>
          <ul style={{ listStyle: 'none', display: 'grid', gap: 8, fontSize: 14 }}>
            <li><a href={`mailto:${CONTACT.email}`} style={{ color: '#E8E8E8' }}>{CONTACT.email}</a></li>
            <li><a href={`https://wa.me/${CONTACT.whatsappDigits}`} target="_blank" rel="noopener noreferrer" style={{ color: '#E8E8E8' }}>WhatsApp · {CONTACT.whatsapp}</a></li>
            <li><a href="https://lolly.sn" style={{ color: '#E8E8E8' }}>lolly.sn</a></li>
          </ul>
        </div>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', color: '#FED700', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>
            Liens
          </p>
          <ul style={{ listStyle: 'none', display: 'grid', gap: 8, fontSize: 14 }}>
            <li><a href="/academy/diagnostic" style={{ color: '#E8E8E8' }}>Diagnostic 2 minutes</a></li>
            <li><a href="https://lolly.sn" style={{ color: '#E8E8E8' }}>Site LOLLY</a></li>
            <li><a href={`mailto:${CONTACT.email}?subject=CGV Academy`} style={{ color: '#E8E8E8' }}>CGV · Confidentialité</a></li>
          </ul>
        </div>
      </div>
      <div
        style={{
          maxWidth: 1120,
          margin: '40px auto 0',
          paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          fontSize: 12,
          color: '#777',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8,
        }}
        className="academy-body"
      >
        <span>LOLLY Communication — {CONTACT.city} — 2026</span>
        <span>Cohorte 1 · ouverture lundi 15 juin 2026</span>
      </div>
    </footer>
  );
}
