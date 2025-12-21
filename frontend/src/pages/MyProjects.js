import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getMyProjects } from "../api";

function MyProjects() {
  const [projects, setProjects] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    getMyProjects(token).then(res => setProjects(res.data));
  }, []);

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>My Assigned Projects</h2>

        {projects.length === 0 && <p>No projects assigned yet</p>}

        {projects.map(project => (
          <div key={project._id} className="course-card">
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

export default MyProjects;
