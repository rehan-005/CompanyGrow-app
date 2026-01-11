import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAllProjects, deleteProject, createProject } from "../api";
import { useNavigate } from "react-router-dom";
import "./Courses.css";
import "./Projects.css";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: "",
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "admin") {
      getAllProjects(token).then((res) => setProjects(res.data));
    }
  }, [token, user]);

  const refreshProjects = async () => {
    const res = await getAllProjects(token);
    setProjects(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (user?.role !== "admin") return;

    if (!formData.title.trim() || !formData.skills.trim()) {
      setError("Title and required skills are required");
      return;
    }

    setCreating(true);
    setError("");

    try {
      await createProject(
        {
          title: formData.title,
          description: formData.description,
          requiredSkills: formData.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        },
        token
      );

      setFormData({ title: "", description: "", skills: "" });
      await refreshProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setCreating(false);
    }
  };

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

        {user?.role === "admin" && (
          <div className="projects-create-card">
            <h3 className="projects-create-title">Create Project</h3>

            {error && <div className="projects-error">{error}</div>}

            <form onSubmit={handleCreateProject}>
              <div className="projects-form-grid">
                <div className="projects-group">
                  <label htmlFor="title">Project Title</label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Project Title"
                    required
                  />
                </div>

                <div className="projects-group">
                  <label htmlFor="skills">Required Skills (comma separated)</label>
                  <input
                    id="skills"
                    name="skills"
                    type="text"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="e.g. React, Node, MongoDB"
                    required
                  />
                </div>
              </div>

              <div className="projects-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Project description (optional)"
                  rows="3"
                />
              </div>

              <div className="projects-actions">
                <button type="submit" className="projects-create-btn" disabled={creating}>
                  {creating ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        )}

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
                className="projects-delete-btn"
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
