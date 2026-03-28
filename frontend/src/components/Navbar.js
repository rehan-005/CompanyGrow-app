import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const handleProfileClick = () => {
    if (user?.role === "admin") {
      navigate("/admin/profile");
    } else {
      navigate("/profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowLogoutMessage(true);
    
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <nav className="navbar">
      {/* Logout Success Message */}
      {showLogoutMessage && (
        <div className="logout-success-message">
          Logout successful
        </div>
      )}
      
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="logo-container" onClick={() => navigate("/courses")}>
            <div className="logo-symbol">CG</div>
            <span className="logo-text">CompanyGrow</span>
          </div>
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
          >
            <span className={`hamburger ${showMobileMenu ? 'active' : ''}`}></span>
          </button>
        </div>

        <div className={`navbar-menu ${showMobileMenu ? 'active' : ''}`}>
          <div className="nav-links">
            {/* COMMON */}
            <button 
              className="nav-link" 
              onClick={() => navigate("/courses")}
            >
              Courses
            </button>

            {/* ADMIN */}
            {user?.role === "admin" && (
              <>
                <button 
                  className="nav-link" 
                  onClick={() => navigate("/projects")}
                >
                  Projects
                </button>
                <button 
                  className="nav-link" 
                  onClick={() => navigate("/admin")}
                >
                  Dashboard
                </button>
              </>
            )}

            {/* EMPLOYEE */}
            {user?.role === "employee" && (
              <button 
                className="nav-link" 
                onClick={() => navigate("/my-projects")}
              >
                My Projects
              </button>
            )}

            {/* PROFILE */}
            <button className="nav-link" onClick={handleProfileClick}>
              Profile
            </button>

            {/* LOGOUT */}
            <button className="nav-link logout-link" onClick={handleLogout}>
              Logout
            </button>
          </div>

          <div className="user-info">
            <div className="user-avatar">
              <span className="avatar-text">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name || 'User'}</span>
              <span className="user-role">{user?.role || 'Employee'}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
