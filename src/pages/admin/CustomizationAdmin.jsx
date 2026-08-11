import { useEffect, useState } from 'react';
import { Check, Palette, RefreshCcw, Sparkles, UploadCloud } from 'lucide-react';
import { defaultSiteTheme, siteThemeFields, siteThemePresets } from '../../config/siteTheme';
import { useAuth } from '../../contexts/AuthContext';
import { useSiteImages } from '../../contexts/SiteImagesContext';
import { useSiteTheme } from '../../contexts/SiteThemeContext';
import { getSiteImageRecords, saveSiteImageSlot } from '../../services/siteImagesService';
import { saveSiteTheme } from '../../services/siteThemeService';
import { deleteStorageFile, uploadSiteImage } from '../../services/storageService';

const HEX_PATTERN = /^#[0-9A-F]{6}$/i;

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
    const normalized = String(value || '').toUpperCase();
    if (!HEX_PATTERN.test(normalized)) return false;
    setForm((current) => ({ ...current, [key]: normalized, preset: 'custom' }));
    setMessage('');
    setError('');
    return true;
  };

  const choosePreset = (preset) => {
    setForm({ ...preset.values });
    setMessage(`Tema “${preset.name}” preparado. Presiona “Guardar y aplicar” para publicarlo.`);
    setError('');
  };

  const save = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      await saveSiteTheme(form);
      setMessage('Personalización guardada. La web pública recibió la paleta completa automáticamente.');
    } catch (saveError) {
      setError(saveError?.message || 'No se pudo guardar la personalización.');
    } finally {
      setSaving(false);
    }
  };

  const restore = () => {
    setForm({ ...defaultSiteTheme });
    setMessage('Colores originales de Amy Blandón preparados. Presiona “Guardar y aplicar” para restaurarlos en la web.');
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
          <p>Administra el logo y la paleta de la web. Cada color se aplica a un grupo visual completo para mantener coherencia.</p>
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
            <p>Los temas cambian la paleta completa de forma coordinada: navegación, héroes, superficies, acentos, bloques oscuros y footer.</p>
          </div>
        </div>

        <div className="customization-presets">
          {siteThemePresets.map((preset) => {
            const selected = form.preset === preset.id;
            const palette = [preset.values.navbarBackground, preset.values.heroBackground, preset.values.accentColor, preset.values.footerBackground];
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
                  {palette.map((color, index) => <i key={`${color}-${index}`} style={{ backgroundColor: color }} />)}
                </span>
                <small>{preset.description}</small>
              </button>
            );
          })}
        </div>

        <div className="customization-original-note">
          <strong>Amy Blandón Original siempre estará disponible.</strong> Hero #001929, navbar #FFFFFF, texto del navbar #042B3A, dorado #C99A44 y footer #001929. Aunque pruebes otros temas, puedes volver a esta identidad cuando quieras.
        </div>
      </section>

      <section className="admin-card customization-colors-card">
        <div className="customization-section-heading">
          <div>
            <p className="admin-eyebrow">Ajuste manual</p>
            <h2>Personalizar colores</h2>
            <p>Parte de un tema y ajusta tonos específicos. El hero tiene su propio color para no perder el tono original al cambiar otros elementos.</p>
          </div>
        </div>

        <div className="customization-color-grid">
          {siteThemeFields.map(([key, label, help]) => (
            <label className="customization-color-field" key={key}>
              <span><strong>{label}</strong><small>{help}</small></span>
              <div>
                <input type="color" value={form[key]} onChange={(event) => setColor(key, event.target.value)} />
                <input
                  key={`${key}-${form[key]}`}
                  type="text"
                  defaultValue={form[key]}
                  maxLength={7}
                  pattern="#[0-9A-Fa-f]{6}"
                  onBlur={(event) => {
                    const value = event.target.value.toUpperCase();
                    if (!setColor(key, value)) {
                      event.target.value = form[key];
                      setError(`El código de “${label}” debe tener el formato #RRGGBB, por ejemplo #001929.`);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      event.currentTarget.blur();
                    }
                  }}
                  aria-label={`Código hexadecimal de ${label}`}
                />
              </div>
            </label>
          ))}
        </div>

        <div className="customization-live-note">
          <strong>Actualización automática y coherente</strong>
          <span>Al guardar, Firestore publica la paleta y la web aplica automáticamente los valores a héroes, textos, bordes, tarjetas y footer. No hace falta redeploy.</span>
        </div>

        <div className="quick-actions customization-actions">
          <button className="btn secondary" type="button" onClick={restore} disabled={saving}>
            <RefreshCcw size={16} /> Restaurar Amy Blandón Original
          </button>
          <button className="btn primary" type="button" onClick={save} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar y aplicar'}
          </button>
        </div>
      </section>
    </>
  );
}
