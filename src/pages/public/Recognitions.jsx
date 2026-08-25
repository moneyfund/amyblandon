import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Award, Maximize2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import { useSiteImages } from '../../contexts/SiteImagesContext';

const slots = [
  { key: 'recognition1', number: '01' },
  { key: 'recognition2', number: '02' },
  { key: 'recognition3', number: '03' },
  { key: 'recognition4', number: '04' },
  { key: 'recognition5', number: '05' },
  { key: 'recognition6', number: '06' },
];

export default function Recognitions() {
  const { images } = useSiteImages();
  const [selected, setSelected] = useState(null);

  const items = useMemo(
    () => slots
      .map((slot) => ({ ...slot, src: String(images[slot.key] || '').trim() }))
      .filter((item) => item.src),
    [images],
  );

  useEffect(() => {
    if (!selected) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setSelected(null);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [selected]);

  return (
    <div className="amy-recognitions-page">
      <SEO
        title="Mis Reconocimientos | Amy Blandón"
        description="Diplomas, certificaciones y reconocimientos profesionales de Amy Blandón."
      />

      <main className="amy-recognitions-main amy-recognitions-main--minimal">
        <div className="amy-recognitions-shell">
          <Link className="amy-recognitions-back amy-recognitions-back--light" to="/sobre-mi">
            <ArrowLeft size={17} aria-hidden="true" />
            Volver a Sobre mí
          </Link>

          <header className="amy-recognitions-title-block">
            <p className="amy-recognitions-kicker">TRAYECTORIA PROFESIONAL</p>
            <h1>Mis Reconocimientos</h1>
            <div className="amy-recognitions-title-rule" aria-hidden="true">
              <span />
              <i />
              <span />
            </div>
            <p className="amy-recognitions-intro">Diplomas, certificaciones y reconocimientos que forman parte de mi trayectoria profesional.</p>
          </header>

          {items.length ? (
            <section className="amy-recognitions-grid" aria-label="Diplomas y reconocimientos de Amy Blandón">
              {items.map((item) => (
                <button
                  className="amy-recognition-card"
                  type="button"
                  key={item.key}
                  onClick={() => setSelected(item)}
                  aria-label={`Ampliar diploma ${item.number}`}
                >
                  <span className="amy-recognition-card__image">
                    <img src={item.src} alt={`Diploma o reconocimiento ${item.number} de Amy Blandón`} loading="lazy" decoding="async" />
                  </span>
                  <span className="amy-recognition-card__footer">
                    <span>DIPLOMA {item.number}</span>
                    <Maximize2 size={16} aria-hidden="true" />
                  </span>
                </button>
              ))}
            </section>
          ) : (
            <section className="amy-recognitions-empty">
              <span className="amy-recognitions-empty__icon"><Award size={30} aria-hidden="true" /></span>
              <h2>Mis diplomas aparecerán aquí.</h2>
              <p>Este espacio está preparado para mostrar los diplomas y reconocimientos que Amy cargue desde el panel de administración.</p>
            </section>
          )}
        </div>
      </main>

      {selected && (
        <div className="amy-recognition-lightbox" role="dialog" aria-modal="true" aria-label="Diploma ampliado" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <button className="amy-recognition-lightbox__close" type="button" onClick={() => setSelected(null)} aria-label="Cerrar">
            <X size={23} aria-hidden="true" />
          </button>
          <img src={selected.src} alt={`Diploma o reconocimiento ${selected.number} ampliado`} />
        </div>
      )}
    </div>
  );
}
