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
    id: 'general',
    eyebrow: 'GENERAL',
    title: 'Contacto y redes del footer',
    text: 'Estos datos son generales para toda la web. El teléfono y WhatsApp se comparten entre ambos rubros. Las redes de este bloque son únicamente las que aparecerán en el footer general.',
    fields: ['phone', 'whatsapp', 'email', 'address', 'schedule', 'facebook', 'instagram', 'tiktok'],
  },
  {
    id: 'real-estate',
    eyebrow: 'BR',
    title: 'Redes de Bienes Raíces',
    text: 'Estos enlaces aparecerán exclusivamente en la sección pública de Bienes Raíces y no modificarán las redes del footer.',
    fields: ['realEstateEmail', 'realEstateFacebook', 'realEstateInstagram', 'realEstateTiktok'],
  },
  {
    id: 'insurance',
    eyebrow: 'SEGUROS',
    title: 'Redes de Seguros',
    text: 'Estos enlaces aparecerán exclusivamente en la sección pública de Seguros y no modificarán las redes del footer.',
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
      {field === 'email' && <small className="admin-help">Correo general. También puede usarse en el footer y contacto principal.</small>}
      {field === 'phone' && <small className="admin-help">Teléfono compartido para Bienes Raíces y Seguros.</small>}
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
          <p>Administra textos, datos de contacto y redes de cada rubro desde un solo lugar.</p>
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
