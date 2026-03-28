import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [skillLevel, setSkillLevel] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (role === "employee" && !skillLevel) newErrors.skillLevel = "Skill level is required for employees";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
        role,
        skillLevel: role === "employee" ? skillLevel : "",
      });

      setShowSuccessMessage(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || "Registration failed" });
    }
  };

  return (
    <div className="register-container">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="success-message">
          Registration successful! Redirecting to login...
        </div>
      )}
      
      <div className="register-wrapper">
        <div className="register-left">
          <div className="brand-section">
            <h1 className="brand-title">Join CompanyGrow</h1>
            <p className="brand-subtitle">Start your professional development journey</p>
            <div className="brand-features">
              <div className="feature-item">
                <div className="feature-icon">📈</div>
                <div className="feature-text">
                  <h4>Career Growth</h4>
                  <p>Advance your skills and expertise</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎯</div>
                <div className="feature-text">
                  <h4>Structured Learning</h4>
                  <p>Follow curated learning paths</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🤝</div>
                <div className="feature-text">
                  <h4>Team Collaboration</h4>
                  <p>Work with industry professionals</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="register-right">
          <div className="register-card">
            <div className="register-header">
              <h2>Create Account</h2>
              <p>Join our professional development platform</p>
            </div>

            {errors.general && (
              <div className="error-message">
                {errors.general}
              </div>
            )}

            <div className="form-row">
              <div className="form-group full-width">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="form-select"
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div className="form-group">
                <label>Skill Level</label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  className={`form-select ${errors.skillLevel ? 'error' : ''}`}
                  disabled={role !== "employee"}
                >
                  <option value="">Select level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                {errors.skillLevel && <span className="error-text">{errors.skillLevel}</span>}
              </div>
            </div>

            <button className="register-btn" onClick={handleRegister}>
              Create Account
            </button>

            <div className="register-footer">
              <p>
                Already have an account?{" "}
                <span
                  className="login-link"
                  onClick={() => navigate("/login")}
                >
                  Sign in here
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
