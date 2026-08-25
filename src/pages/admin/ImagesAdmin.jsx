import { useEffect, useMemo, useState } from 'react';
import { ImagePlus, Images, RefreshCcw, UploadCloud } from 'lucide-react';
import { siteImages, siteImageSlots } from '../../config/siteImages';
import { useAuth } from '../../contexts/AuthContext';
import { getSiteImageRecords, resetSiteImageSlot, saveSiteImageSlot } from '../../services/siteImagesService';
import { deleteStorageFile, uploadSiteImage } from '../../services/storageService';

const formatBytes = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function ImagesAdmin() {
  const { user } = useAuth();
  const [records, setRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState('');
  const [progress, setProgress] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  const visibleSlots = useMemo(
    () => siteImageSlots.filter((slot) => {
      if (activeTab === 'heroHome') return slot.group === 'heroHome';
      if (activeTab === 'heroAbout') return slot.group === 'heroAbout';
      if (activeTab === 'heroBr') return slot.group === 'heroBr';
      if (activeTab === 'recognitions') return slot.group === 'recognitions';
      return !slot.group;
    }),
    [activeTab],
  );

  const load = () => {
    setLoading(true);
    setError('');
    return getSiteImageRecords()
      .then(setRecords)
      .catch(() => setError('No se pudieron cargar las imágenes configuradas.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const replaceImage = async (slot, file) => {
    if (!file) return;
    const previous = records[slot.key];
    setBusyKey(slot.key);
    setMessage('');
    setError('');
    setProgress((current) => ({ ...current, [slot.key]: 0 }));

    try {
      const uploaded = await uploadSiteImage(slot.key, file, (value) => {
        setProgress((current) => ({ ...current, [slot.key]: value }));
      });
      const saved = await saveSiteImageSlot(slot.key, { ...uploaded, updatedBy: user?.uid || '' });
      setRecords((current) => ({ ...current, [slot.key]: saved }));
      setMessage(`“${slot.label}” se actualizó correctamente. La web pública recibirá el cambio automáticamente.`);
      if (previous?.path && previous.path !== uploaded.path) deleteStorageFile(previous.path).catch(() => {});
    } catch (uploadError) {
      setError(uploadError?.message || `No se pudo actualizar “${slot.label}”.`);
    } finally {
      setBusyKey('');
      setProgress((current) => ({ ...current, [slot.key]: 0 }));
    }
  };

  const restoreDefault = async (slot) => {
    const previous = records[slot.key];
    if (previous?.isDefault) return;
    if (!window.confirm(`¿Restaurar la imagen predeterminada de “${slot.label}”?`)) return;
    setBusyKey(slot.key);
    setMessage('');
    setError('');
    try {
      const restored = await resetSiteImageSlot(slot.key);
      setRecords((current) => ({ ...current, [slot.key]: restored }));
      setMessage(`“${slot.label}” volvió a su imagen predeterminada.`);
      if (previous?.path) deleteStorageFile(previous.path).catch(() => {});
    } catch {
      setError(`No se pudo restaurar “${slot.label}”.`);
    } finally {
      setBusyKey('');
    }
  };

  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="admin-eyebrow">Biblioteca visual</p>
          <h1>Imágenes</h1>
          <p>Cambia las imágenes principales sin editar código. Los archivos se guardan en Firebase Storage y sus referencias en Firestore.</p>
        </div>
      </div>

      <section className="admin-card admin-images-intro">
        <ImagePlus aria-hidden="true" />
        <div>
          <h2>Imágenes conectadas con la web pública</h2>
          <p>Cada espacio tiene una función fija. Al reemplazar una imagen, las pestañas abiertas de la web reciben la nueva URL mediante Firestore en tiempo real.</p>
          <strong>Para las imágenes recortadas de Amy y la firma usa PNG o WEBP con fondo transparente.</strong>
        </div>
      </section>

      <div className="admin-image-tabs" role="tablist" aria-label="Categorías de imágenes">
        <button type="button" role="tab" aria-selected={activeTab === 'general'} className={activeTab === 'general' ? 'active' : ''} onClick={() => setActiveTab('general')}>
          <ImagePlus size={18} /> Imágenes generales
        </button>
        <button type="button" role="tab" aria-selected={activeTab === 'heroHome'} className={activeTab === 'heroHome' ? 'active' : ''} onClick={() => setActiveTab('heroHome')}>
          <Images size={18} /> Hero de Inicio <span className="admin-image-tabs__count">4</span>
        </button>
        <button type="button" role="tab" aria-selected={activeTab === 'heroAbout'} className={activeTab === 'heroAbout' ? 'active' : ''} onClick={() => setActiveTab('heroAbout')}>
          <Images size={18} /> Hero Sobre mí <span className="admin-image-tabs__count">5</span>
        </button>
        <button type="button" role="tab" aria-selected={activeTab === 'heroBr'} className={activeTab === 'heroBr' ? 'active' : ''} onClick={() => setActiveTab('heroBr')}>
          <Images size={18} /> Imágenes Hero BR <span className="admin-image-tabs__count">5</span>
        </button>
        <button type="button" role="tab" aria-selected={activeTab === 'recognitions'} className={activeTab === 'recognitions' ? 'active' : ''} onClick={() => setActiveTab('recognitions')}>
          <Images size={18} /> Mis Reconocimientos <span className="admin-image-tabs__count">6</span>
        </button>
      </div>

      {activeTab === 'heroHome' && (
        <section className="admin-card admin-hero-br-note"><Images aria-hidden="true" /><div><h2>Fondos rotativos del Hero de Inicio</h2><p>Estas cuatro imágenes aparecen detrás de Amy en la portada principal y cambian automáticamente cada 3 segundos.</p></div></section>
      )}
      {activeTab === 'heroAbout' && (
        <section className="admin-card admin-hero-br-note"><Images aria-hidden="true" /><div><h2>Hero administrable de Sobre mí</h2><p>Aquí el fondo y Amy se administran por separado. El fondo permanece fijo y las imágenes recortadas de Amy cambian automáticamente cada 3 segundos.</p></div></section>
      )}
      {activeTab === 'heroBr' && (
        <section className="admin-card admin-hero-br-note"><Images aria-hidden="true" /><div><h2>Imágenes del buscador de Bienes Raíces</h2><p>Estas cinco imágenes aparecen en el hero animado de la página de Bienes Raíces y conservan su transición actual.</p></div></section>
      )}
      {activeTab === 'recognitions' && (
        <section className="admin-card admin-hero-br-note admin-recognition-note">
          <Images aria-hidden="true" />
          <div>
            <h2>Mis Reconocimientos</h2>
            <p>Este espacio es exclusivamente para subir los diplomas, certificados y reconocimientos de Amy que aparecerán en la página pública “Mis Reconocimientos”.</p>
            <strong>Sube cada diploma completo, nítido y con buena resolución para que pueda ampliarse correctamente en la web.</strong>
          </div>
        </section>
      )}

      {message && <p className="success" role="status">{message}</p>}
      {error && <p className="error" role="alert">{error}</p>}

      {loading ? <p>Cargando imágenes...</p> : (
        <div className="admin-image-grid">
          {visibleSlots.map((slot) => {
            const record = records[slot.key] || { url: siteImages[slot.key], isDefault: true };
            const slotBusy = busyKey === slot.key;
            const slotProgress = progress[slot.key] || 0;
            return (
              <article className="admin-image-card" key={slot.key}>
                <div className={`admin-image-preview admin-image-preview--${slot.preview}`}>
                  {record.url ? <img src={record.url} alt={`Vista previa: ${slot.label}`} /> : <ImagePlus aria-hidden="true" size={44} />}
                  <span>{record.isDefault ? (record.url ? 'Imagen predeterminada' : 'Sin imagen cargada') : 'Imagen personalizada'}</span>
                </div>
                <div className="admin-image-card__body">
                  <div><p className="admin-image-card__eyebrow">{slot.shortLabel}</p><h2>{slot.label}</h2></div>
                  <p>{slot.description}</p>
                  <small>{slot.recommendation}</small>
                  {!record.isDefault && <small className="admin-image-file">Archivo actual: {record.name || 'imagen subida'}{record.size ? ` · ${formatBytes(record.size)}` : ''}</small>}
                  {slotProgress > 0 && slotProgress < 100 && <div className="admin-upload-progress"><span>Subiendo: {slotProgress}%</span><progress value={slotProgress} max="100" /></div>}
                  <div className="admin-image-actions">
                    <label className={`btn primary ${slotBusy ? 'is-disabled' : ''}`}>
                      <UploadCloud size={17} /> {slotBusy ? 'Procesando...' : 'Reemplazar imagen'}
                      <input type="file" accept="image/jpeg,image/png,image/webp" disabled={slotBusy} onChange={(event) => { const [file] = event.target.files || []; replaceImage(slot, file); event.target.value = ''; }} />
                    </label>
                    <button className="btn secondary" type="button" disabled={slotBusy || record.isDefault} onClick={() => restoreDefault(slot)}>
                      <RefreshCcw size={16} /> Restaurar predeterminada
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
