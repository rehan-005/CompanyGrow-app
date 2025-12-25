import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Courses from "./pages/Courses";
import Register from "./pages/Register";
import Projects from "./pages/Projects";
import CreateProfile from "./pages/CreateProfile";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AddCourse from "./pages/AddCourse";
import AdminProfile from "./pages/AdminProfile";
import MyProjects from "./pages/MyProjects";
import EmployeeDetails from "./pages/EmployeeDetails";
import AddProject from "./pages/AddProject";
import LandingPage from "./pages/LandingPage";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/projects" element={<Projects />} />
        <Route
          path="/create-profile"
          element={token ? <CreateProfile /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={token ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={token ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/add-course"
          element={token ? <AddCourse /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/profile"
          element={token ? <AdminProfile /> : <Navigate to="/login" />}
        />
        <Route
          path="/courses"
          element={token ? <Courses /> : <Navigate to="/login" />}
        />
        <Route
          path="*"
          element={<Navigate to={token ? "/courses" : "/"} />}
        />
        <Route path="/my-projects" element={<MyProjects />} />
        <Route path="/employee/:userId" element={<EmployeeDetails />} />
        <Route
          path="/admin/add-project"
          element={token ? <AddProject /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
