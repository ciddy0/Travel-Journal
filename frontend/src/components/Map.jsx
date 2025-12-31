import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./Map.css";
import pinIcon from "../assets/pin.png";
import { Calendar } from "lucide-react";

// Custom marker icon using your own PNG
const customIcon = new L.Icon({
  iconUrl: pinIcon,
  iconRetinaUrl: pinIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
});

const Map = ({ locations, onMarkerClick, onMapClick }) => {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: "100vh", width: "100%" }}
      onClick={onMapClick}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.x, location.y]}
          icon={customIcon}
          eventHandlers={{
            click: () => onMarkerClick(location),
          }}
        >
          <Popup className="custom-popup">
            <div className="popup-content">
              <div className="popup-header">
                <h3 className="popup-title">{location.title}</h3>
              </div>

              <div className="popup-location">
                <span className="location-text">
                  {location.city}, {location.country}
                </span>
              </div>

              {location.description && (
                <p className="popup-description">{location.description}</p>
              )}

              {location.visited_at && (
                <div className="popup-date">
                  <span className="date-icon">
                    <Calendar />
                  </span>
                  <span className="date-text">
                    {new Date(location.visited_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}

              {location.image_url && (
                <div className="popup-image-container">
                  <img
                    src={location.image_url}
                    alt={location.title}
                    className="popup-image"
                  />
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
