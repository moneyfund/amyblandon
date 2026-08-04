import { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import PropertyCard from '../../components/properties/PropertyCard';
import { getProperties } from '../../services/propertyService';
import { money } from '../../utils/format';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function Fit({ items }) {
  const map = useMap();

  useEffect(() => {
    const points = items
      .filter((property) => Number.isFinite(property.latitude) && Number.isFinite(property.longitude))
      .map((property) => [property.latitude, property.longitude]);

    if (points.length) {
      map.fitBounds(points, { padding: [40, 40] });
    }
  }, [items, map]);

  return null;
}

export default function MapView({ embedded = false, properties }) {
  const [items, setItems] = useState(properties || []);

  useEffect(() => {
    if (!properties) {
      getProperties().then(setItems);
    } else {
      setItems(properties);
    }
  }, [properties]);

  return (
    <section className={embedded ? 'mapWrap embedded' : 'mapWrap'}>
      <div className="filters">
        <input placeholder="Search location" />
      </div>
      <MapContainer center={[28.5, -81.3]} zoom={7} scrollWheelZoom={false}>
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Fit items={items} />
        {items.map((property) => (
          <Marker key={property.id} position={[property.latitude, property.longitude]}>
            <Popup>
              {money(property.price, property.currency)}
              <br />
              {property.title}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="mapCards">
        {items.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
}
