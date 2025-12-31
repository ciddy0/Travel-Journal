import { useState, useEffect } from "react";
import Map from "./components/Map";
import Login from "./components/Login";
import LocationForm from "./components/LocationForm";
import { MapPinCheck, MapPinned, Sparkles, Trash } from "lucide-react";
import {
  getLocations,
  deleteLocation,
  isAuthenticated,
  logout,
} from "./services/api";
import "./App.css";

function App() {
  const [locations, setLocations] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const data = await getLocations();
      setLocations(data);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setShowForm(false);
  };

  const handleAddLocation = () => {
    setSelectedLocation(null);
    setShowForm(true);
  };

  const handleMarkerClick = (location) => {
    if (isLoggedIn) {
      setSelectedLocation(location);
      setShowForm(true);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedLocation(null);
    fetchLocations();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedLocation(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this memory? :c")) {
      try {
        await deleteLocation(id);
        fetchLocations();
        setShowForm(false);
        setSelectedLocation(null);
      } catch (error) {
        console.error("Failed to delete location:", error);
        alert("Failed to delete location");
      }
    }
  };

  if (!isLoggedIn && loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-icon">🗺️</div>
          <div>Loading your adventures...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Header */}
      <div className="app-header">
        <div className="header-title-section">
          <span className="header-icon">
            <MapPinned />
          </span>
          <h1 className="header-title">My Travel Journal</h1>
        </div>

        {isLoggedIn && (
          <div className="header-buttons">
            <div className="stats-badge">
              <span>
                <MapPinCheck />
              </span>
              <span>{locations.length} places explored</span>
            </div>
            <button onClick={handleAddLocation} className="btn btn-primary">
              <span className="btn-icon">
                <Sparkles />
              </span>
              <span>New Adventure</span>
            </button>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="map-container">
        <Map locations={locations} onMarkerClick={handleMarkerClick} />
      </div>

      {/* Location Form Sidebar */}
      {showForm && isLoggedIn && (
        <LocationForm
          location={selectedLocation}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}

      {/* Delete button when editing */}
      {showForm && selectedLocation && isLoggedIn && (
        <button
          onClick={() => handleDelete(selectedLocation.id)}
          className="delete-button"
        >
          <span className="btn-icon">
            <Trash />
          </span>
          <span>Delete Memory</span>
        </button>
      )}

      {/* Login overlay for non-authenticated users */}
      {!isLoggedIn && <Login onLoginSuccess={handleLoginSuccess} />}
    </div>
  );
}

export default App;
