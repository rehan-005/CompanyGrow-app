import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAllProjects } from "../api";
import { useNavigate } from "react-router-dom";

function Projects() {
  const [projects, setProjects] = useState([]);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate(); // ✅ ADD THIS

  useEffect(() => {
    if (user?.role === "admin") {
      getAllProjects(token).then((res) => setProjects(res.data));
    }
  }, [token, user]);

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
          </div>
        ))}
      </div>
    </>
  );
}

export default Projects;
