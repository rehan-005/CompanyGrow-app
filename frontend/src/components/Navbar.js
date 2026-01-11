import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleProfileClick = () => {
    if (user?.role === "admin") {
      navigate("/admin/profile");
    } else {
      navigate("/profile");
    }
  };

  return (
    <div className="navbar">
      <h2 className="logo" onClick={() => navigate("/courses")}>
        CompanyGrow
      </h2>

      <div>
        {/* COMMON */}
        <button className="nav-btn" onClick={() => navigate("/courses")}>
          Courses
        </button>

        {/* ADMIN */}
        {user?.role === "admin" && (
          <>
            <button className="nav-btn" onClick={() => navigate("/projects")}>
              Projects
            </button>
          </>
        )}

        {/* EMPLOYEE */}
        {user?.role === "employee" && (
          <>
            <button
              className="nav-btn"
              onClick={() => navigate("/my-projects")}
            >
              My Projects
            </button>
          </>
        )}

        {/* PROFILE */}
        <button className="nav-btn" onClick={handleProfileClick}>
          Profile
        </button>

        {/* LOGOUT */}
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
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
