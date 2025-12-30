import { useState, useEffect } from "react";
import { createLocation, updateLocation } from "../services/api";

function LocationForm({ location, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    city: "",
    country: "",
    x: "",
    y: "",
    description: "",
    image_url: "",
    visited_at: "",
  });

  useEffect(() => {
    if (location) {
      setFormData({
        title: location.title || "",
        city: location.city || "",
        country: location.country || "",
        x: location.x || "",
        y: location.y || "",
        description: location.description || "",
        image_url: location.image_url || "",
        visited_at: location.visited_at
          ? location.visited_at.split("T")[0]
          : "",
      });
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert to backend format
      const dataToSend = {
        title: formData.title.trim(),
        city: formData.city.trim(),
        country: formData.country.trim(),
        x: parseFloat(formData.x),
        y: parseFloat(formData.y),
        description: formData.description.trim() || null,
        image_url: formData.image_url.trim() || null,
        visited_at: formData.visited_at
          ? new Date(formData.visited_at).toISOString()
          : null,
      };

      console.log("Sending data:", dataToSend);

      if (location) {
        await updateLocation(location.id, dataToSend);
      } else {
        await createLocation(dataToSend);
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to save location:", error);
      console.error("Error response:", error.response?.data);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        JSON.stringify(error.response?.data) ||
        "Failed to save location";
      alert(errorMessage);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "60px",
        right: 0,
        width: "400px",
        height: "calc(100vh - 60px)",
        backgroundColor: "white",
        boxShadow: "-2px 0 8px rgba(0,0,0,0.1)",
        padding: "20px",
        overflowY: "auto",
        zIndex: 1000,
      }}
    >
      <h2>{location ? "Edit Location" : "Add Location"}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Title: *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            City: *
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Country: *
          </label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Longitude (x): *
          </label>
          <input
            type="number"
            step="any"
            value={formData.x}
            onChange={(e) => setFormData({ ...formData, x: e.target.value })}
            required
            placeholder="-180 to 180"
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Latitude (y): *
          </label>
          <input
            type="number"
            step="any"
            value={formData.y}
            onChange={(e) => setFormData({ ...formData, y: e.target.value })}
            required
            placeholder="-90 to 90"
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Date Visited:
          </label>
          <input
            type="date"
            value={formData.visited_at}
            onChange={(e) =>
              setFormData({ ...formData, visited_at: e.target.value })
            }
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Image URL:
          </label>
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) =>
              setFormData({ ...formData, image_url: e.target.value })
            }
            placeholder="https://example.com/image.jpg"
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Description:
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows="4"
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {location ? "Update" : "Add"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "#666",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default LocationForm;
