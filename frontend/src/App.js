import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Courses from "./pages/Courses";
import Register from "./pages/Register";
import Projects from "./pages/Projects";
import CreateProfile from "./pages/CreateProfile";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import AdminDashboard from "./pages/AdminDashboard";
import AddCourse from "./pages/AddCourse";
import AdminProfile from "./pages/AdminProfile";
import MyProjects from "./pages/MyProjects";
import EmployeeDetails from "./pages/EmployeeDetails";
import "./App.css";

// Create a custom event for auth changes
const AUTH_CHANGE_EVENT = 'auth-change';

function triggerAuthChange() {
  window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT));
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.role === "admin";
  const isAuthenticated = !!token;

  useEffect(() => {
    const handleAuthChange = () => {
      const currentToken = localStorage.getItem("token");
      setToken(currentToken);
    };

    // Listen for custom auth change events
    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    
    // Also listen for storage events (for other tabs)
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  // Create a wrapper for setToken that triggers the event
  const handleSetToken = (newToken) => {
    setToken(newToken);
    triggerAuthChange();
  };

  return (
    <BrowserRouter>
      <div className="app-layout">
        {isAuthenticated && <Sidebar />}
        <div className={`main-content ${isAuthenticated ? 'with-sidebar' : ''}`}>
          <Routes>
            <Route path="/login" element={<Login setToken={handleSetToken} />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/projects"
              element={token && isAdmin ? <Projects /> : <Navigate to={token ? "/courses" : "/login"} />}
            />
            <Route
              path="/create-profile"
              element={token ? <CreateProfile /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile"
              element={token ? <Profile /> : <Navigate to="/login" />}
            />
            <Route
              path="/edit-profile"
              element={token ? <EditProfile /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin"
              element={token && isAdmin ? <AdminDashboard /> : <Navigate to={token ? "/courses" : "/login"} />}
            />
            <Route
              path="/admin/courses"
              element={token && isAdmin ? <Courses /> : <Navigate to={token ? "/courses" : "/login"} />}
            />
            <Route
              path="/admin/add-course"
              element={token && isAdmin ? <AddCourse /> : <Navigate to={token ? "/courses" : "/login"} />}
            />
            <Route
              path="/admin/profile"
              element={token && isAdmin ? <AdminProfile /> : <Navigate to={token ? "/courses" : "/login"} />}
            />
            <Route
              path="/courses"
              element={token ? <Courses /> : <Navigate to="/login" />}
            />
            <Route
              path="*"
              element={<Navigate to={token ? "/courses" : "/login"} />}
            />
            <Route path="/my-projects" element={<MyProjects />} />
            <Route path="/employee/:userId" element={<EmployeeDetails />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
