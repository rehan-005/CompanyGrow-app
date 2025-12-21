import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Admin Dashboard</h2>

        <button onClick={() => navigate("/admin/add-course")}>
          Add Course
        </button>

        <button onClick={() => navigate("/admin/courses")}>
          View Courses
        </button>

        <button onClick={() => navigate("/admin/profile")}>
          My Profile
        </button>
      </div>
    </>
  );
}

export default AdminDashboard;
