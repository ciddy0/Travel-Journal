import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
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
          eventHandlers={{
            click: () => onMarkerClick(location),
          }}
        >
          <Popup>
            <div>
              <h3>{location.title}</h3>
              <p>
                <strong>
                  {location.city}, {location.country}
                </strong>
              </p>
              {location.description && <p>{location.description}</p>}
              {location.visited_at && (
                <p>
                  <em>
                    Visited:{" "}
                    {new Date(location.visited_at).toLocaleDateString()}
                  </em>
                </p>
              )}
              {location.image_url && (
                <img
                  src={location.image_url}
                  alt={location.title}
                  style={{
                    width: "100%",
                    maxWidth: "200px",
                    marginTop: "10px",
                  }}
                />
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
