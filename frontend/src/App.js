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

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <BrowserRouter>
      <Routes>
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
          element={<Navigate to={token ? "/courses" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
