import { useEffect, useState } from 'react';
import { Check, Palette, RefreshCcw, Sparkles, UploadCloud } from 'lucide-react';
import { defaultSiteTheme, siteThemeFields, siteThemePresets } from '../../config/siteTheme';
import { useAuth } from '../../contexts/AuthContext';
import { useSiteImages } from '../../contexts/SiteImagesContext';
import { useSiteTheme } from '../../contexts/SiteThemeContext';
import { getSiteImageRecords, saveSiteImageSlot } from '../../services/siteImagesService';
import { saveSiteTheme } from '../../services/siteThemeService';
import { deleteStorageFile, uploadSiteImage } from '../../services/storageService';

export default function CustomizationAdmin() {
  const { user } = useAuth();
  const { images } = useSiteImages();
  const { theme } = useSiteTheme();
  const [form, setForm] = useState(theme);
  const [logoRecord, setLogoRecord] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => setForm(theme), [theme]);

  useEffect(() => {
    getSiteImageRecords()
      .then((records) => setLogoRecord(records.brandLogo))
      .catch(() => {});
  }, []);

  const setColor = (key, value) => {
    setForm((current) => ({ ...current, [key]: value.toUpperCase(), preset: 'custom' }));
    setMessage('');
  };

  const choosePreset = (preset) => {
    setForm({ ...preset.values });
    setMessage('');
    setError('');
  };

  const save = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      await saveSiteTheme(form);
      setMessage('Personalización guardada. La web pública recibe estos colores automáticamente.');
    } catch (saveError) {
      setError(saveError?.message || 'No se pudo guardar la personalización.');
    } finally {
      setSaving(false);
    }
  };

  const restore = () => {
    setForm({ ...defaultSiteTheme });
    setMessage('Tema Amy Clásico preparado. Presiona “Guardar y aplicar” para publicarlo.');
    setError('');
  };

  const replaceLogo = async (file) => {
    if (!file) return;
    const previous = logoRecord;
    setUploading(true);
    setProgress(0);
    setMessage('');
    setError('');
    try {
      const uploaded = await uploadSiteImage('brandLogo', file, setProgress);
      const saved = await saveSiteImageSlot('brandLogo', {
        ...uploaded,
        updatedBy: user?.uid || '',
      });
      setLogoRecord(saved);
      setMessage('Logo actualizado. Se aplicará tanto en el panel como en la web pública automáticamente.');
      if (previous?.path && previous.path !== uploaded.path) deleteStorageFile(previous.path).catch(() => {});
    } catch (uploadError) {
      setError(uploadError?.message || 'No se pudo actualizar el logo.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="admin-eyebrow">Identidad visual</p>
          <h1>Personalización</h1>
          <p>Administra el logo, la paleta y los principales colores de la web sin editar código.</p>
        </div>
      </div>

      {message && <p className="success" role="status">{message}</p>}
      {error && <p className="error" role="alert">{error}</p>}

      <section className="admin-card customization-logo-card">
        <div className="customization-section-heading">
          <div className="customization-icon"><Sparkles /></div>
          <div>
            <p className="admin-eyebrow">Marca</p>
            <h2>Logo de Amy Blandón</h2>
            <p>Este mismo archivo se mostrará en el navbar público y en la parte superior del panel privado.</p>
          </div>
        </div>
        <div className="customization-logo-grid">
          <div className="customization-logo-preview">
            {images.brandLogo ? <img src={images.brandLogo} alt="Logo actual de Amy Blandón" /> : <span>AMY BLANDON</span>}
          </div>
          <div className="customization-logo-actions">
            <p>Recomendado: PNG o WEBP horizontal con fondo transparente y poco margen alrededor del nombre.</p>
            {progress > 0 && progress < 100 && (
              <div className="admin-upload-progress"><span>Subiendo: {progress}%</span><progress value={progress} max="100" /></div>
            )}
            <label className={`btn primary ${uploading ? 'is-disabled' : ''}`}>
              <UploadCloud size={17} /> {uploading ? 'Subiendo logo...' : 'Subir o reemplazar logo'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={uploading}
                onChange={(event) => {
                  const [file] = event.target.files || [];
                  replaceLogo(file);
                  event.target.value = '';
                }}
              />
            </label>
          </div>
        </div>
      </section>

      <section className="admin-card customization-theme-card">
        <div className="customization-section-heading">
          <div className="customization-icon"><Palette /></div>
          <div>
            <p className="admin-eyebrow">Temas profesionales</p>
            <h2>Elige una identidad base</h2>
            <p>Los temas cambian la paleta manteniendo la estructura y el estilo premium de la web.</p>
          </div>
        </div>

        <div className="customization-presets">
          {siteThemePresets.map((preset) => {
            const selected = form.preset === preset.id;
            const palette = [preset.values.navbarBackground, preset.values.primaryColor, preset.values.accentColor, preset.values.footerBackground];
            return (
              <button
                type="button"
                key={preset.id}
                className={`customization-preset ${selected ? 'is-selected' : ''}`}
                onClick={() => choosePreset(preset)}
              >
                <span className="customization-preset__top">
                  <strong>{preset.name}</strong>
                  {selected && <Check size={18} />}
                </span>
                <span className="customization-palette" aria-hidden="true">
                  {palette.map((color) => <i key={color} style={{ backgroundColor: color }} />)}
                </span>
                <small>{preset.description}</small>
              </button>
            );
          })}
        </div>
      </section>

      <section className="admin-card customization-colors-card">
        <div className="customization-section-heading">
          <div>
            <p className="admin-eyebrow">Ajuste manual</p>
            <h2>Personalizar colores</h2>
            <p>Puedes partir de un tema y ajustar únicamente los tonos que quieras cambiar.</p>
          </div>
        </div>

        <div className="customization-color-grid">
          {siteThemeFields.map(([key, label, help]) => (
            <label className="customization-color-field" key={key}>
              <span><strong>{label}</strong><small>{help}</small></span>
              <div>
                <input type="color" value={form[key]} onChange={(event) => setColor(key, event.target.value)} />
                <input
                  type="text"
                  value={form[key]}
                  maxLength={7}
                  pattern="#[0-9A-Fa-f]{6}"
                  onChange={(event) => setColor(key, event.target.value)}
                  aria-label={`Código hexadecimal de ${label}`}
                />
              </div>
            </label>
          ))}
        </div>

        <div className="customization-live-note">
          <strong>Actualización automática</strong>
          <span>Al guardar, Firestore publica la configuración y las páginas abiertas reciben el cambio en tiempo real. No hace falta volver a desplegar la web.</span>
        </div>

        <div className="quick-actions customization-actions">
          <button className="btn secondary" type="button" onClick={restore} disabled={saving}>
            <RefreshCcw size={16} /> Restaurar Amy Clásico
          </button>
          <button className="btn primary" type="button" onClick={save} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar y aplicar'}
          </button>
        </div>
      </section>
    </>
  );
}
