import { useEffect, useMemo, useState } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { LocateFixed, MapPin, Search, X } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const NICARAGUA_CENTER = [12.8654, -85.2072];
const NICARAGUA_ZOOM = 7;

const asCoordinate = (value, min, max) => {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= min && parsed <= max ? parsed : null;
};

function ClickToSelect({ onSelect }) {
  useMapEvents({
    click(event) {
      onSelect(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

function Recenter({ position, zoom = 15 }) {
  const map = useMap();

  useEffect(() => {
    if (!position) return;
    map.flyTo(position, zoom, { duration: 0.7 });
  }, [map, position, zoom]);

  return null;
}

export default function PropertyMapPicker({ latitude, longitude, onChange, onAddressSelect }) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const position = useMemo(() => {
    const lat = asCoordinate(latitude, -90, 90);
    const lng = asCoordinate(longitude, -180, 180);
    if (lat === null || lng === null || (lat === 0 && lng === 0)) return null;
    return [lat, lng];
  }, [latitude, longitude]);

  useEffect(() => {
    const term = search.trim();
    if (term.length < 3) {
      setResults([]);
      setError('');
      return undefined;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams({
          q: `${term}, Nicaragua`,
          format: 'jsonv2',
          countrycodes: 'ni',
          addressdetails: '1',
          limit: '5',
          'accept-language': 'es',
        });
        const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) throw new Error('No se pudo consultar el servicio de ubicación.');
        const data = await response.json();
        setResults(Array.isArray(data) ? data : []);
        if (!data.length) setError('No encontramos coincidencias en Nicaragua.');
      } catch (searchError) {
        if (searchError.name !== 'AbortError') {
          setResults([]);
          setError('No se pudo realizar la búsqueda. También puedes marcar la ubicación directamente en el mapa.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 500);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [search]);

  const selectCoordinates = (lat, lng, label = '') => {
    const normalizedLat = Number(lat).toFixed(7);
    const normalizedLng = Number(lng).toFixed(7);
    onChange(normalizedLat, normalizedLng);
    if (label) {
      setSearch(label);
      onAddressSelect?.(label);
    }
    setResults([]);
    setError('');
  };

  const selectResult = (result) => {
    selectCoordinates(result.lat, result.lon, result.display_name || '');
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Este navegador no permite obtener la ubicación actual.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        selectCoordinates(coords.latitude, coords.longitude);
        setLoading(false);
      },
      () => {
        setError('No fue posible obtener la ubicación actual. Revisa el permiso de ubicación del navegador.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const clearLocation = () => {
    onChange('', '');
    setSearch('');
    setResults([]);
    setError('');
  };

  return (
    <div className="property-map-picker">
      <div className="property-map-picker__search">
        <Search size={18} aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar barrio, residencial, ciudad o carretera"
          aria-label="Buscar una ubicación en Nicaragua"
        />
        {search && (
          <button type="button" aria-label="Limpiar búsqueda" onClick={() => { setSearch(''); setResults([]); }}>
            <X size={17} />
          </button>
        )}
      </div>

      {loading && <p className="property-map-picker__status">Buscando ubicación...</p>}
      {error && <p className="property-map-picker__status property-map-picker__status--error">{error}</p>}

      {results.length > 0 && (
        <div className="property-map-picker__results" role="listbox" aria-label="Resultados de ubicación">
          {results.map((result) => (
            <button key={`${result.place_id}-${result.lat}-${result.lon}`} type="button" onClick={() => selectResult(result)}>
              <MapPin size={17} aria-hidden="true" />
              <span>{result.display_name}</span>
            </button>
          ))}
        </div>
      )}

      <div className="property-map-picker__map">
        <MapContainer
          center={position || NICARAGUA_CENTER}
          zoom={position ? 15 : NICARAGUA_ZOOM}
          scrollWheelZoom
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickToSelect onSelect={selectCoordinates} />
          <Recenter position={position} />
          {position && <Marker position={position} />}
        </MapContainer>
      </div>

      <div className="property-map-picker__actions">
        <button type="button" className="btn secondary" onClick={useCurrentLocation} disabled={loading}>
          <LocateFixed size={17} /> Usar mi ubicación
        </button>
        {position && (
          <button type="button" className="btn secondary" onClick={clearLocation}>
            <X size={17} /> Quitar marcador
          </button>
        )}
      </div>

      <p className="admin-help">
        Busca una zona o haz clic directamente sobre el mapa. Las coordenadas se guardarán al guardar la propiedad.
      </p>
    </div>
  );
}
