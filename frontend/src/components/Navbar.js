import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <h2 className="logo" onClick={() => navigate("/courses")}>
        CompanyGrow
      </h2>

      <div>
        <button
          className="nav-btn"
          onClick={() => navigate("/courses")}
        >
          Courses
        </button>

        <button
          className="nav-btn"
          onClick={() => navigate("/projects")}
        >
          Projects
        </button>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
