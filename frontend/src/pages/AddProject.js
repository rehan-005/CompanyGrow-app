import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { createProject } from "../api";

function AddProject() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title || !skills) {
      alert("Title and skills are required");
      return;
    }

    try {
      await createProject(
        {
          title,
          description,
          requiredSkills: skills.split(",").map(s => s.trim()),
        },
        token
      );

      alert("Project created successfully");
      navigate("/projects");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create project");
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <div className="login-card">
          <h2>Create Project</h2>

          <input
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ marginBottom: "10px" }}
          />

          <input
            placeholder="Required Skills (comma separated)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />

          <button className="login-btn" onClick={handleSubmit}>
            Create Project
          </button>
        </div>
      </div>
    </>
  );
}

export default AddProject;
