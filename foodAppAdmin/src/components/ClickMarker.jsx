import { useMapEvents, Marker } from "react-leaflet";
import { useState } from "react";

function ClickMarker({ onSelect }) {
  const [pos, setPos] = useState(null);

  useMapEvents({
    click(e) {
      setPos(e.latlng);
      onSelect(e.latlng);
    },
  });

  return pos ? <Marker position={pos} /> : null;
}
