import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Login.css";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("employee"); // UI only
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
        role: selectedRole, // optional, backend decides real role
      });

      const token = res.data.token;
      const user = res.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setToken(token);

      alert("Login successful");
      console.log("test");
      navigate("/courses");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* ✅ ROLE SELECTION (UI ONLY) */}
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>

        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>

        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Don’t have an account?{" "}
          <span
            style={{ color: "#3498db", cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
