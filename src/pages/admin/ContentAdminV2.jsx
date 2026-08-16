import { useEffect, useMemo, useState } from 'react';
import {
  AlignLeft,
  Building2,
  CheckCircle2,
  ExternalLink,
  Home,
  PanelBottom,
  RefreshCcw,
  Save,
  ShieldCheck,
  UserRound,
  Contact,
} from 'lucide-react';
import { contentEditorSections, contentSectionOrder } from '../../config/contentEditorConfig';
import { aboutContentDefaults, aboutEditorSection } from '../../config/aboutRedesignContent';
import { defaultSiteContent, getSiteContent, saveSiteContent } from '../../services/siteContentService';

const editorSections = {
  ...contentEditorSections,
  about: aboutEditorSection,
};

const tabIcons = {
  home: Home,
  about: UserRound,
  realEstate: Building2,
  insurance: ShieldCheck,
  contact: Contact,
  footer: PanelBottom,
};

function defaultsForSection(key) {
  if (key === 'about') {
    return { ...(defaultSiteContent.about || {}), ...aboutContentDefaults };
  }
  return { ...(defaultSiteContent[key] || {}) };
}

function fieldPlaceholder(type) {
  if (type === 'email') return 'correo@ejemplo.com';
  if (type === 'url') return 'https://...';
  if (type === 'tel') return '+505 0000 0000';
  return '';
}

function EditorField({ definition, value, onChange }) {
  const [field, label, type = 'text', rows = 3, help = ''] = definition;
  const longField = type === 'textarea';

  return (
    <label className={`content-editor__field ${longField ? 'content-editor__field--wide' : ''}`}>
      <span className="content-editor__field-label">{label}</span>
      {longField ? (
        <textarea
          rows={rows}
          value={value || ''}
          onChange={(event) => onChange(field, event.target.value)}
          spellCheck="true"
        />
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={(event) => onChange(field, event.target.value)}
          placeholder={fieldPlaceholder(type)}
          spellCheck={type === 'text'}
        />
      )}
      {(help || longField) && (
        <small className="content-editor__help">
          {help || 'Los saltos de línea que escribas aquí se respetarán en la web cuando este texto admita varias líneas.'}
        </small>
      )}
    </label>
  );
}

export default function ContentAdminV2() {
  const [tab, setTab] = useState('home');
  const [data, setData] = useState(() => defaultsForSection('home'));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [dirty, setDirty] = useState(false);

  const section = editorSections[tab];
  const totalFields = useMemo(
    () => section.groups.reduce((total, group) => total + group.fields.length, 0),
    [section],
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    setMessage('');
    setError('');
    setDirty(false);

    getSiteContent(tab)
      .then((content) => {
        if (!active) return;
        setData({ ...defaultsForSection(tab), ...(content || {}) });
      })
      .catch(() => {
        if (!active) return;
        setData(defaultsForSection(tab));
        setError('No se pudo cargar el contenido guardado. Se muestran los textos predeterminados como respaldo.');
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [tab]);

  const setField = (field, value) => {
    setDirty(true);
    setMessage('');
    setData((current) => ({ ...current, [field]: value }));
  };

  const changeTab = (nextTab) => {
    if (nextTab === tab) return;
    if (dirty && !window.confirm('Tienes cambios sin guardar. ¿Quieres cambiar de página y descartarlos?')) return;
    setTab(nextTab);
  };

  const restoreDefaults = () => {
    if (!window.confirm('Se cargarán los textos recomendados de esta página en el formulario. No se publicarán hasta que presiones “Guardar y publicar”.')) return;
    setData(defaultsForSection(tab));
    setDirty(true);
    setMessage('Textos recomendados cargados. Revisa y guarda cuando estés conforme.');
    setError('');
  };

  const save = async (event) => {
    event.preventDefault();
    if (saving || loading) return;
    setSaving(true);
    setMessage('');
    setError('');

    try {
      await saveSiteContent(tab, data);
      setDirty(false);
      setMessage('Cambios guardados y publicados correctamente.');
    } catch (saveError) {
      console.error('No se pudo guardar el contenido web:', saveError);
      setError('No se pudo guardar el contenido. Revisa tu conexión e inténtalo nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="content-editor">
      <div className="admin-heading content-editor__heading">
        <div>
          <p className="admin-eyebrow">CONTENIDO WEB</p>
          <h1>Editor completo de la web pública</h1>
          <p>
            Administra los textos de cada página sin tocar el código. Los cambios se guardan en Firebase y se reflejan en la web pública.
          </p>
        </div>
        <div className="content-editor__heading-actions">
          <a className="content-editor__preview" href={section.route} target="_blank" rel="noreferrer">
            Ver página <ExternalLink size={17} />
          </a>
        </div>
      </div>

      <div className="content-editor__format-note">
        <AlignLeft size={20} aria-hidden="true" />
        <div>
          <strong>El formato del texto se conserva</strong>
          <p>
            Puedes copiar y pegar párrafos. Usa <b>Enter</b> para crear un salto de línea y doble Enter para separar ideas; la web respetará esa estructura en los campos de texto largo.
          </p>
        </div>
      </div>

      <nav className="content-editor__tabs" aria-label="Páginas editables">
        {contentSectionOrder.map((key) => {
          const Icon = tabIcons[key];
          return (
            <button
              key={key}
              type="button"
              className={tab === key ? 'active' : ''}
              onClick={() => changeTab(key)}
              aria-current={tab === key ? 'page' : undefined}
            >
              <Icon size={19} aria-hidden="true" />
              <span>{editorSections[key].label}</span>
            </button>
          );
        })}
      </nav>

      <div className="content-editor__section-intro">
        <div>
          <span>{editorSections[tab].label}</span>
          <h2>{section.description}</h2>
        </div>
        <p>{totalFields} campos editables</p>
      </div>

      {loading ? (
        <div className="content-editor__loading">
          <span className="spinner" aria-hidden="true" />
          <p>Cargando contenido...</p>
        </div>
      ) : (
        <form onSubmit={save} className="content-editor__form">
          {section.groups.map((group, groupIndex) => (
            <fieldset className="content-editor__group" key={`${tab}-${group.title}`}>
              <legend>
                <span>{String(groupIndex + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{group.title}</strong>
                  {group.description && <small>{group.description}</small>}
                </div>
              </legend>
              <div className="content-editor__grid">
                {group.fields.map((definition) => (
                  <EditorField
                    key={definition[0]}
                    definition={definition}
                    value={data[definition[0]]}
                    onChange={setField}
                  />
                ))}
              </div>
            </fieldset>
          ))}

          <div className="content-editor__actions">
            <button type="button" className="content-editor__reset" onClick={restoreDefaults} disabled={saving}>
              <RefreshCcw size={17} /> Restaurar textos recomendados
            </button>
            <div className="content-editor__save-wrap">
              {dirty && <span className="content-editor__dirty">Cambios sin guardar</span>}
              <button className="content-editor__save" type="submit" disabled={saving}>
                {saving ? <span className="spinner" /> : <Save size={18} />}
                {saving ? 'Guardando...' : 'Guardar y publicar'}
              </button>
            </div>
          </div>

          {(message || error) && (
            <div className={`content-editor__status ${error ? 'content-editor__status--error' : 'content-editor__status--success'}`} role="status">
              {!error && <CheckCircle2 size={18} />}
              <span>{error || message}</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
