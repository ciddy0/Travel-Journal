import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./Map.css";
import pinIcon from "../assets/pin.png";
import { Calendar, MapPin } from "lucide-react";
import { getImageUrl } from "../services/api";

// Custom marker icon using my own PNG :D
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

// Custom Marker component with hover card
const HoverMarker = ({ location, onMarkerClick }) => {
  const markerRef = useRef(null);
  const map = useMap();
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState(null);

  // process the image URL
  const imageUrl = getImageUrl(location.image_url);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    const handleMouseOver = () => {
      const latLng = marker.getLatLng();
      const point = map.latLngToContainerPoint(latLng);

      setPosition({
        x: point.x,
        y: point.y,
      });

      setIsHovered(true);
    };

    const handleMouseOut = () => setIsHovered(false);

    marker.addEventListener("mouseover", handleMouseOver);
    marker.addEventListener("mouseout", handleMouseOut);

    return () => {
      marker.removeEventListener("mouseover", handleMouseOver);
      marker.removeEventListener("mouseout", handleMouseOut);
    };
  }, [map]);

  return (
    <>
      <Marker
        ref={markerRef}
        position={[location.x, location.y]}
        icon={customIcon}
        eventHandlers={{
          click: () => onMarkerClick(location),
        }}
      />
      {/* Hover Card */}
      {isHovered && position && (
        <div
          className="hover-card"
          style={{
            position: "absolute",
            left: position.x,
            top: position.y - 50,
            transform: "translate(-50%, -100%)",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          <div className="hover-card-content">
            {/* Image */}
            {location.image_url && (
              <div className="hover-card-image">
                <img src={imageUrl} alt={location.title} />
                <div className="hover-card-image-overlay" />
              </div>
            )}

            {/* Content */}
            <div className="hover-card-body">
              <h3 className="hover-card-title">{location.title}</h3>

              <div className="hover-card-location">
                <MapPin size={14} />
                <span>
                  {location.city}, {location.country}
                </span>
              </div>

              {location.visited_at && (
                <div className="hover-card-date">
                  {new Date(location.visited_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              )}

              {location.description && (
                <p className="hover-card-description">{location.description}</p>
              )}
            </div>

            {/* Arrow pointer */}
            <div className="hover-card-arrow" />
          </div>
        </div>
      )}
    </>
  );
};

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
        <HoverMarker
          key={location.id}
          location={location}
          onMarkerClick={onMarkerClick}
        />
      ))}
    </MapContainer>
  );
};

export default Map;
