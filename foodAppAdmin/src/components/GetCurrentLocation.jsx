import { useState } from "react";

export default function GetCurrentLocation({ onLocationSelect, buttonText = "Get Current Location" }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);

  const handleClick = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(coords);
        onLocationSelect(coords); // send to parent
        setLoading(false);
      },
      (err) => {
        setError("Unable to retrieve your location");
        console.error(err);
        setLoading(false);
      }
    );
  };

  return (
    <div style={{ margin: "10px 0" }}>
      <button className="form-control mb-2" type="button" onClick={handleClick} disabled={loading}>
        {loading ? "Getting location..." : buttonText}
      </button>

      {location && (
        <p>
          Selected Location: lat: {location.lat.toFixed(4)}, lng: {location.lng.toFixed(4)}
        </p>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
