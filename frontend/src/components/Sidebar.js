import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Trigger auth change event
    window.dispatchEvent(new CustomEvent('auth-change'));
    
    setShowLogoutMessage(true);
    
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const menuItems = [
    {
      title: "Main",
      icon: "🏠",
      items: [
        { name: "Dashboard", path: "/courses", icon: "📊" },
      ]
    },
    {
      title: "Learning",
      icon: "📚",
      items: [
        { name: "Courses", path: "/courses", icon: "📖" },
        { name: "My Progress", path: "/progress", icon: "📈" },
      ]
    }
  ];

  const adminItems = [
    {
      title: "Management",
      icon: "⚙️",
      items: [
        { name: "Dashboard", path: "/admin", icon: "🎛️" },
        { name: "Projects", path: "/projects", icon: "🚀" },
        { name: "Courses", path: "/admin/courses", icon: "📚" },
        { name: "Add Course", path: "/admin/add-course", icon: "➕" },
      ]
    },
    {
      title: "Users",
      icon: "👥",
      items: [
        { name: "All Users", path: "/admin/users", icon: "👤" },
        { name: "User Analytics", path: "/admin/analytics", icon: "📊" },
      ]
    }
  ];

  const userItems = [
    {
      title: "Personal",
      icon: "👤",
      items: [
        { name: "My Profile", path: "/profile", icon: "📝" },
        { name: "My Projects", path: "/my-projects", icon: "💼" },
        { name: "Settings", path: "/settings", icon: "⚙️" },
      ]
    }
  ];

  const allItems = user?.role === "admin" 
    ? [...menuItems, ...adminItems, ...userItems]
    : [...menuItems, ...userItems];

  return (
    <div className="sidebar">
      {/* Logout Success Message */}
      {showLogoutMessage && (
        <div className="logout-success-message">
          Logout successful
        </div>
      )}
      
      {/* Logo Section */}
      <div className="sidebar-header">
        <div className="logo-section" onClick={() => navigate("/courses")}>
          <div className="logo-symbol">CG</div>
          <div className="logo-text">
            <span className="company-name">CompanyGrow</span>
            <span className="company-tagline">Learning Platform</span>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="user-section">
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

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {allItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="nav-section">
            <button
              className={`section-header ${expandedSections[section.title] ? 'expanded' : ''}`}
              onClick={() => toggleSection(section.title)}
            >
              <span className="section-icon">{section.icon}</span>
              <span className="section-title">{section.title}</span>
              <span className={`expand-icon ${expandedSections[section.title] ? 'rotated' : ''}`}>
                ▼
              </span>
            </button>
            
            <div className={`section-content ${expandedSections[section.title] ? 'show' : ''}`}>
              {section.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <span className="item-icon">{item.icon}</span>
                  <span className="item-name">{item.name}</span>
                  {isActive(item.path) && <span className="active-indicator">●</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <span className="logout-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
