import { useEffect, useState } from 'react';
import { getSiteContent, saveSiteContent } from '../../services/siteContentService';
import { contentFieldLabels, contentSectionLabels } from '../../config/adminLabels.es';

const contentSections = {
  home: [
    'heroTitle',
    'heroSubtitle',
    'heroLabel',
    'aboutTitle',
    'aboutText',
    'strategicTitle',
    'strategicLabel',
  ],
  about: ['title', 'subtitle', 'biography', 'mission', 'values'],
  realEstate: ['heroEyebrow', 'heroTitle', 'heroText', 'ctaTitle', 'ctaText'],
  contact: [],
};

const contactGroups = [
  {
    id: 'shared',
    eyebrow: 'GENERAL',
    title: 'Contacto compartido',
    text: 'Estos datos se comparten entre Bienes Raíces y Seguros. El mismo teléfono y WhatsApp se usan en ambos rubros.',
    fields: ['phone', 'whatsapp', 'address', 'schedule'],
  },
  {
    id: 'footer',
    eyebrow: 'FOOTER',
    title: 'Redes generales del footer',
    text: 'Estas son las cuentas generales que aparecerán en el footer de toda la web. Amy puede elegir aquí las redes que considere más importantes, sin afectar las redes específicas de cada rubro.',
    fields: ['email', 'facebook', 'instagram', 'tiktok'],
  },
  {
    id: 'real-estate',
    eyebrow: 'BR',
    title: 'Redes de Bienes Raíces',
    text: 'Estos enlaces aparecerán exclusivamente dentro de la página pública de Bienes Raíces, en una sección dedicada a este rubro.',
    fields: ['realEstateEmail', 'realEstateFacebook', 'realEstateInstagram', 'realEstateTiktok'],
  },
  {
    id: 'insurance',
    eyebrow: 'SEGUROS',
    title: 'Redes de Seguros',
    text: 'Estos enlaces aparecerán exclusivamente dentro de la página pública de Seguros, completamente separados de las redes de Bienes Raíces.',
    fields: ['insuranceEmail', 'insuranceFacebook', 'insuranceInstagram', 'insuranceTiktok'],
  },
];

const urlFields = new Set([
  'facebook', 'instagram', 'tiktok',
  'realEstateFacebook', 'realEstateInstagram', 'realEstateTiktok',
  'insuranceFacebook', 'insuranceInstagram', 'insuranceTiktok',
]);
const emailFields = new Set(['email', 'realEstateEmail', 'insuranceEmail']);

function fieldPlaceholder(field) {
  if (emailFields.has(field)) return 'correo@ejemplo.com';
  if (field.toLowerCase().includes('facebook')) return 'https://facebook.com/usuario';
  if (field.toLowerCase().includes('instagram')) return 'https://instagram.com/usuario';
  if (field.toLowerCase().includes('tiktok')) return 'https://tiktok.com/@usuario';
  if (field === 'phone' || field === 'whatsapp') return '+505 0000 0000';
  return '';
}

function ContactField({ field, value, onChange }) {
  const isUrl = urlFields.has(field);
  const isEmail = emailFields.has(field);
  const isLongText = ['address', 'schedule'].includes(field);

  return (
    <label className="contact-admin-field">
      <span>{contentFieldLabels[field] || field}</span>
      {isLongText ? (
        <textarea value={value || ''} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input
          type={isUrl ? 'url' : (isEmail ? 'email' : 'text')}
          value={value || ''}
          onChange={(event) => onChange(event.target.value)}
          placeholder={fieldPlaceholder(field)}
        />
      )}
      {isUrl && <small className="admin-help">Pega el enlace completo del perfil, incluyendo https://</small>}
      {field === 'email' && <small className="admin-help">Este correo pertenece al contacto general y al footer.</small>}
      {field === 'phone' && <small className="admin-help">Teléfono compartido para Bienes Raíces y Seguros.</small>}
      {field === 'whatsapp' && <small className="admin-help">WhatsApp compartido para ambos rubros.</small>}
    </label>
  );
}

export default function ContentAdminV2() {
  const [tab, setTab] = useState('home');
  const [data, setData] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMessage('');
    setError('');
    getSiteContent(tab)
      .then(setData)
      .catch(() => setError('No se pudo cargar el contenido de esta sección.'));
  }, [tab]);

  const setField = (field, value) => setData((current) => ({ ...current, [field]: value }));

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      await saveSiteContent(tab, data);
      setMessage('Contenido guardado correctamente.');
    } catch {
      setError('No se pudo guardar el contenido.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="admin-eyebrow">Web pública</p>
          <h1>Editar contenido de la web</h1>
          <p>Administra textos, contacto general y redes específicas de cada rubro desde un solo lugar.</p>
        </div>
      </div>

      <div className="quick-actions admin-tabs">
        {Object.keys(contentSections).map((section) => (
          <button
            key={section}
            type="button"
            className={`btn ${tab === section ? 'primary' : 'secondary'}`}
            onClick={() => setTab(section)}
          >
            {contentSectionLabels[section]}
          </button>
        ))}
      </div>

      <form className={`admin-form ${tab === 'contact' ? 'contact-admin-form' : ''}`} onSubmit={save}>
        {tab === 'contact' ? (
          <div className="contact-admin-groups">
            {contactGroups.map((group) => (
              <fieldset className={`contact-admin-group contact-admin-group--${group.id}`} key={group.id}>
                <legend><span>{group.eyebrow}</span>{group.title}</legend>
                <p className="contact-admin-group__description">{group.text}</p>
                <div className="contact-admin-group__grid">
                  {group.fields.map((field) => (
                    <ContactField
                      key={field}
                      field={field}
                      value={data[field]}
                      onChange={(value) => setField(field, value)}
                    />
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        ) : (
          contentSections[tab].map((field) => (
            <label key={field}>
              {contentFieldLabels[field] || field}
              <textarea
                value={data[field] || ''}
                onChange={(event) => setField(field, event.target.value)}
              />
            </label>
          ))
        )}

        <div className="contact-admin-actions">
          <button className="btn primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar contenido'}</button>
          {message && <p className="success">{message}</p>}
          {error && <p className="error">{error}</p>}
        </div>
      </form>
    </>
  );
}
