import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAllProjects, deleteProject } from "../api";
import { useNavigate } from "react-router-dom";

function Projects() {
  const [projects, setProjects] = useState([]);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "admin") {
      getAllProjects(token).then((res) => setProjects(res.data));
    }
  }, [token, user]);

  const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await deleteProject(projectId, token);
      alert("Project deleted successfully");

      // Update UI without refresh
      setProjects((prev) =>
        prev.filter((project) => project._id !== projectId)
      );
    } catch (err) {
      alert("Failed to delete project");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Projects</h2>

        {projects.map((project) => (
          <div key={project._id} className="course-card">
            <h3>{project.title}</h3>

            <p>
              <b>Required Skills:</b>{" "}
              {project.requiredSkills.join(", ")}
            </p>

            <p>
              <b>Status:</b> {project.status}
            </p>

            {project.assignedTo && (
              <p>
                <b>Assigned To:</b>{" "}
                <span
                  style={{
                    color: "#3498db",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={() =>
                    navigate(`/employee/${project.assignedTo._id}`)
                  }
                >
                  {project.assignedTo.name}
                </span>
              </p>
            )}

            {/* ✅ ADMIN DELETE BUTTON */}
            {user?.role === "admin" && (
              <button
                style={{
                  backgroundColor: "#e74c3c",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
                onClick={() => handleDelete(project._id)}
              >
                Delete Project
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default Projects;
