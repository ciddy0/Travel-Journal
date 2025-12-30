import { useState, useEffect } from "react";
import Map from "./components/Map";
import Login from "./components/Login";
import LocationForm from "./components/LocationForm";
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
    if (window.confirm("Are you sure you want to delete this location?")) {
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
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      {/* Header */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "60px",
          backgroundColor: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          zIndex: 999,
        }}
      >
        <h1 style={{ margin: 0, fontSize: "24px" }}>My Travel Journal</h1>

        {isLoggedIn && (
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleAddLocation}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Add Location
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: "10px 20px",
                backgroundColor: "#666",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Map */}
      <div style={{ paddingTop: "60px" }}>
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
          style={{
            position: "fixed",
            bottom: "20px",
            right: "420px",
            padding: "10px 20px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            zIndex: 1001,
          }}
        >
          Delete Location
        </button>
      )}

      {/* Login overlay for non-authenticated users */}
      {!isLoggedIn && <Login onLoginSuccess={handleLoginSuccess} />}
    </div>
  );
}

export default App;
