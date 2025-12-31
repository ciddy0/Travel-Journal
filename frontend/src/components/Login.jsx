import { useState } from "react";
import { login } from "../services/api";
import "./Login.css";
import { Plane } from "lucide-react";

function Login({ onLoginSuccess }) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials.username, credentials.password);
      onLoginSuccess();
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <Plane />
          </div>
          <h2 className="login-title">Cid's Travel Journal</h2>
          <p className="login-subtitle">My personal travel journal :D</p>
          <p className="login-subtitle">Click guest to view</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="login-label">Username</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              className="login-input"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label className="login-label">Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              className="login-input"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-button">
            <span>Let's Go!</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
