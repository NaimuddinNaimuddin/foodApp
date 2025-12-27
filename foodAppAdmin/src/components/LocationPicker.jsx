import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";

// Fix default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

export default function LocationPicker({ onLocationSelect }) {
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState(null);

  const searchLocation = async () => {
    if (!query) return;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
    );
    const data = await res.json();

    if (data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);

      setPosition([lat, lng]);
      onLocationSelect({ lat, lng });
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search location..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />
      <button type="button" onClick={searchLocation}>
        Search
      </button>

      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "500px", marginTop: 10 }}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {position && (
          <>
            <ChangeView center={position} />
            <Marker position={position} />
          </>
        )}
      </MapContainer>
    </div>
  );
}
