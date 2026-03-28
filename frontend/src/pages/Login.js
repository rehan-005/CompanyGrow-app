import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Login.css";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("employee");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
        role: selectedRole,
      });

      const token = res.data.token;
      const user = res.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setToken(token);

      setShowSuccessMessage(true);
      setTimeout(() => {
        navigate("/courses");
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="success-message">
          Login successful
        </div>
      )}
      
      <div className="login-wrapper">
        <div className="login-left">
          <div className="brand-section">
            <h1 className="brand-title">CompanyGrow</h1>
            <p className="brand-subtitle">Empowering Your Business Growth</p>
            <div className="brand-features">
              <div className="feature-item">
                <span className="feature-icon">🚀</span>
                <span>Scale Your Operations</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Track Progress</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">👥</span>
                <span>Team Collaboration</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="login-right">
          <div className="login-card">
            <div className="login-header">
              <h2>Welcome Back</h2>
              <p>Sign in to your CompanyGrow account</p>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="form-select"
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button className="login-btn" onClick={handleLogin}>
              Sign In
            </button>

            <div className="login-footer">
              <p>
                Don't have an account?{" "}
                <span
                  className="register-link"
                  onClick={() => navigate("/register")}
                >
                  Register here
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
