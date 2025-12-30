import axios from "axios";

const API_URL = "local://localhost:8080";

// create axios instance >:)
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// add token to request if it exists
api.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// auth
export const login = async (username, password) => {
  const response = await api.post("/login", { username, password });
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// get all locations :D
export const getLocations = async () => {
  const response = await api.get("/locations");
  return response.data;
};

// get a single location
export const getLocation = async (id) => {
  const response = await api.get(`/locations/${id}`);
  return response.data;
};

// create a new location hehe
export const createLocation = async (locationData) => {
  const response = await api.post("/locations", locationData);
  return response.data;
};

// update a location >:)
export const updateLocation = async (id, locationData) => {
  const response = await api.put(`/locations/${id}`, locationData);
  return response.data;
};

// delete a location D:
export const deleteLocation = async (id) => {
  const response = await api.delete(`/locations/${id}`);
};

export default api;
