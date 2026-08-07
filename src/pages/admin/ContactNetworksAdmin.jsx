import { useEffect, useState } from 'react';
import { getSiteContent, saveSiteContent, defaultSiteContent } from '../../services/siteContentService';

const groups = [
  {
    key: 'shared',
    badge: 'GENERAL',
    title: 'Contacto compartido',
    description: 'Datos que se utilizan de forma general en la web. El teléfono y WhatsApp son los mismos para Bienes Raíces y Seguros.',
    fields: [
      ['phone', 'Teléfono general', 'tel', 'Ej. +505 8832 4439'],
      ['whatsapp', 'WhatsApp general', 'tel', 'Ej. +505 8832 4439'],
      ['address', 'Dirección', 'text', 'Ej. Matagalpa, Nicaragua'],
      ['schedule', 'Horario de atención', 'text', 'Ej. Lunes a viernes'],
    ],
  },
  {
    key: 'footer',
    badge: 'FOOTER',
    title: 'Redes generales del footer',
    description: 'Estas son las redes que aparecerán en el footer general de toda la web. Amy puede colocar aquí las cuentas que considere más importantes.',
    fields: [
      ['email', 'Correo general / Footer', 'email', 'correo@ejemplo.com'],
      ['facebook', 'Facebook general / Footer', 'url', 'https://facebook.com/...'],
      ['instagram', 'Instagram general / Footer', 'url', 'https://instagram.com/...'],
      ['tiktok', 'TikTok general / Footer', 'url', 'https://tiktok.com/@...'],
    ],
  },
  {
    key: 'realEstate',
    badge: 'BR',
    title: 'Redes de Bienes Raíces',
    description: 'Estas cuentas aparecerán únicamente dentro de la página pública de Bienes Raíces, en una sección dedicada a ese rubro.',
    fields: [
      ['realEstateEmail', 'BR — Correo electrónico', 'email', 'correo@ejemplo.com'],
      ['realEstateFacebook', 'BR — Facebook', 'url', 'https://facebook.com/...'],
      ['realEstateInstagram', 'BR — Instagram', 'url', 'https://instagram.com/...'],
      ['realEstateTiktok', 'BR — TikTok', 'url', 'https://tiktok.com/@...'],
    ],
  },
  {
    key: 'insurance',
    badge: 'SEGUROS',
    title: 'Redes de Seguros',
    description: 'Estas cuentas aparecerán únicamente dentro de la página pública de Seguros, separadas de las redes de Bienes Raíces.',
    fields: [
      ['insuranceEmail', 'Seguros — Correo electrónico', 'email', 'correo@ejemplo.com'],
      ['insuranceFacebook', 'Seguros — Facebook', 'url', 'https://facebook.com/...'],
      ['insuranceInstagram', 'Seguros — Instagram', 'url', 'https://instagram.com/...'],
      ['insuranceTiktok', 'Seguros — TikTok', 'url', 'https://tiktok.com/@...'],
    ],
  },
];

export default function ContactNetworksAdmin() {
  const [data, setData] = useState(defaultSiteContent.contact);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getSiteContent('contact')
      .then(setData)
      .catch(() => setError('No se pudo cargar la configuración de contacto.'))
      .finally(() => setLoading(false));
  }, []);

  const set = (field, value) => setData((current) => ({ ...current, [field]: value }));

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      await saveSiteContent('contact', data);
      setMessage('Contacto y redes guardados correctamente.');
    } catch {
      setError('No se pudieron guardar los cambios. Revisa la conexión con Firestore.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Cargando contacto y redes...</p>;

  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="admin-eyebrow">Contacto público</p>
          <h1>Contacto y redes</h1>
          <p>Administra por separado las redes de Bienes Raíces, Seguros y las redes generales del footer.</p>
        </div>
      </div>

      <form className="contact-admin-form" onSubmit={save}>
        <div className="contact-admin-groups">
          {groups.map((group) => (
            <fieldset className={`contact-admin-group contact-admin-group--${group.key}`} key={group.key}>
              <legend><span>{group.badge}</span>{group.title}</legend>
              <p className="contact-admin-group__description">{group.description}</p>
              <div className="contact-admin-group__grid">
                {group.fields.map(([field, label, type, placeholder]) => (
                  <label className="contact-admin-field" key={field}>
                    <span>{label}</span>
                    <input
                      type={type === 'tel' ? 'text' : type}
                      value={data[field] || ''}
                      onChange={(event) => set(field, event.target.value)}
                      placeholder={placeholder}
                    />
                    {type === 'url' && <small className="admin-help">Pega el enlace completo, preferiblemente comenzando con https://</small>}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="contact-admin-actions">
          <button className="btn primary" type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar contacto y redes'}</button>
          {message && <p className="success">{message}</p>}
          {error && <p className="error">{error}</p>}
        </div>
      </form>
    </>
  );
}
