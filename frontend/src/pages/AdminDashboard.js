import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const dashboardCards = [
    {
      title: "Course Management",
      description: "Create, edit, and manage training courses",
      icon: "📚",
      color: "blue",
      actions: [
        { label: "View All Courses", path: "/admin/courses" },
        { label: "Add New Course", path: "/admin/add-course" }
      ]
    },
    {
      title: "Project Management",
      description: "Oversee and manage employee projects",
      icon: "🚀",
      color: "purple",
      actions: [
        { label: "View Projects", path: "/projects" }
      ]
    },
    {
      title: "User Management",
      description: "Manage employee profiles and access",
      icon: "👥",
      color: "green",
      actions: [
        { label: "View Employees", path: "/admin/employees" }
      ]
    },
    {
      title: "Analytics & Reports",
      description: "Track progress and generate reports",
      icon: "📊",
      color: "orange",
      actions: [
        { label: "View Analytics", path: "/admin/analytics" }
      ]
    }
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <p>Manage your organization's learning and development platform</p>
        </div>
        <div className="admin-profile">
          <button 
            className="profile-btn"
            onClick={() => navigate("/admin/profile")}
          >
            <span className="profile-icon">👤</span>
            My Profile
          </button>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>Total Courses</h3>
            <p className="stat-number">12</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Active Employees</h3>
            <p className="stat-number">48</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚀</div>
          <div className="stat-content">
            <h3>Projects</h3>
            <p className="stat-number">23</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Completions</h3>
            <p className="stat-number">156</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {dashboardCards.map((card, index) => (
          <div key={index} className={`dashboard-card ${card.color}`}>
            <div className="card-header">
              <div className="card-icon">{card.icon}</div>
              <h3>{card.title}</h3>
            </div>
            <p className="card-description">{card.description}</p>
            <div className="card-actions">
              {card.actions.map((action, actionIndex) => (
                <button
                  key={actionIndex}
                  className="action-btn"
                  onClick={() => navigate(action.path)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">🎓</div>
            <div className="activity-content">
              <p><strong>John Doe</strong> completed "React Fundamentals"</p>
              <span className="activity-time">2 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">📝</div>
            <div className="activity-content">
              <p><strong>Jane Smith</strong> submitted project "E-commerce Platform"</p>
              <span className="activity-time">4 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">👥</div>
            <div className="activity-content">
              <p><strong>5 new employees</strong> enrolled in "Python Basics"</p>
              <span className="activity-time">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
