import { useEffect, useMemo, useState } from 'react';
import { Award, ImagePlus, RefreshCcw, UploadCloud } from 'lucide-react';
import { siteImages, siteImageSlots } from '../../config/siteImages';
import { useAuth } from '../../contexts/AuthContext';
import { getSiteImageRecords, resetSiteImageSlot, saveSiteImageSlot } from '../../services/siteImagesService';
import { deleteStorageFile, uploadSiteImage } from '../../services/storageService';

const formatBytes = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function RecognitionsImagesAdmin() {
  const { user } = useAuth();
  const [records, setRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState('');
  const [progress, setProgress] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const slots = useMemo(() => siteImageSlots.filter((slot) => slot.group === 'recognitions'), []);

  useEffect(() => {
    getSiteImageRecords().then(setRecords).catch(() => setError('No se pudieron cargar los reconocimientos.')).finally(() => setLoading(false));
  }, []);

  const replaceImage = async (slot, file) => {
    if (!file) return;
    const previous = records[slot.key];
    setBusyKey(slot.key); setMessage(''); setError('');
    try {
      const uploaded = await uploadSiteImage(slot.key, file, (value) => setProgress((c) => ({ ...c, [slot.key]: value })));
      const saved = await saveSiteImageSlot(slot.key, { ...uploaded, updatedBy: user?.uid || '' });
      setRecords((c) => ({ ...c, [slot.key]: saved }));
      setMessage(`“${slot.label}” se publicó correctamente en Mis Reconocimientos.`);
      if (previous?.path && previous.path !== uploaded.path) deleteStorageFile(previous.path).catch(() => {});
    } catch (e) {
      setError(e?.message || `No se pudo subir “${slot.label}”.`);
    } finally {
      setBusyKey(''); setProgress((c) => ({ ...c, [slot.key]: 0 }));
    }
  };

  const removeImage = async (slot) => {
    const previous = records[slot.key];
    if (previous?.isDefault || !previous?.url) return;
    if (!window.confirm(`¿Quitar “${slot.label}” de la página pública?`)) return;
    setBusyKey(slot.key); setMessage(''); setError('');
    try {
      const restored = await resetSiteImageSlot(slot.key);
      setRecords((c) => ({ ...c, [slot.key]: restored }));
      if (previous?.path) deleteStorageFile(previous.path).catch(() => {});
      setMessage('Reconocimiento eliminado correctamente.');
    } catch {
      setError('No se pudo eliminar el reconocimiento.');
    } finally { setBusyKey(''); }
  };

  return (
    <div className="recognitions-images-admin">
      <section className="admin-card admin-recognition-note">
        <Award aria-hidden="true" />
        <div><h2>Galería de diplomas</h2><p>Cada espacio corresponde a un diploma visible en la página pública. Puedes subir, reemplazar o retirar cada imagen de forma independiente.</p><strong>Usa fotografías o escaneos nítidos, completos y sin reflejos.</strong></div>
      </section>
      {message && <p className="success" role="status">{message}</p>}
      {error && <p className="error" role="alert">{error}</p>}
      {loading ? <p>Cargando reconocimientos...</p> : (
        <div className="admin-image-grid">
          {slots.map((slot, index) => {
            const record = records[slot.key] || { url: siteImages[slot.key], isDefault: true };
            const busy = busyKey === slot.key;
            const pct = progress[slot.key] || 0;
            return (
              <article className="admin-image-card" key={slot.key}>
                <div className={`admin-image-preview admin-image-preview--${slot.preview || 'cover'}`}>
                  {record.url ? <img src={record.url} alt={`Diploma ${index + 1}`} /> : <ImagePlus aria-hidden="true" size={44} />}
                  <span>{record.url ? `Diploma ${index + 1}` : 'Espacio disponible'}</span>
                </div>
                <div className="admin-image-card__body">
                  <div><p className="admin-image-card__eyebrow">MIS RECONOCIMIENTOS</p><h2>Diploma {index + 1}</h2></div>
                  <p>{slot.description || 'Imagen que aparecerá en la galería pública de reconocimientos.'}</p>
                  {!record.isDefault && record.name && <small className="admin-image-file">Archivo: {record.name}{record.size ? ` · ${formatBytes(record.size)}` : ''}</small>}
                  {pct > 0 && pct < 100 && <div className="admin-upload-progress"><span>Subiendo: {pct}%</span><progress value={pct} max="100" /></div>}
                  <div className="admin-image-actions">
                    <label className={`btn primary ${busy ? 'is-disabled' : ''}`}><UploadCloud size={17} /> {record.url ? 'Reemplazar diploma' : 'Subir diploma'}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={(e) => { const [file] = e.target.files || []; replaceImage(slot, file); e.target.value = ''; }} /></label>
                    <button className="btn secondary" type="button" disabled={busy || record.isDefault || !record.url} onClick={() => removeImage(slot)}><RefreshCcw size={16} /> Quitar</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
