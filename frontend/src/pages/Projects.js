import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";

function Projects() {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects(res.data);
    } catch (err) {
      alert("Failed to load projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ padding: "30px" }}>
        <h2>Projects</h2>

        {projects.map((project) => (
          <div
            key={project._id}
            style={{
              background: "#fff",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "6px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h3>{project.title}</h3>
            <p>
              <b>Required Skills:</b>{" "}
              {project.requiredSkills.join(", ")}
            </p>
            <p>
              <b>Status:</b> {project.status}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export default Projects;
