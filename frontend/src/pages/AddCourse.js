import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";
import "./AddCourse.css";

function AddCourse() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skill: "Frontend",
    level: "Beginner",
    skillTags: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Title and description are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await API.post(
        "/courses",
        {
          title: formData.title,
          description: formData.description,
          skill: formData.skill,
          level: formData.level,
          skillTags: formData.skillTags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Course added successfully");
      navigate("/courses");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="add-course-container">
        <div className="add-course-form">
          <h2>Add Course</h2>

          {error && <div className="add-course-error">{error}</div>}

          <form onSubmit={handleAdd}>
            <div className="add-course-group">
              <label htmlFor="title">Course Title</label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Course Title"
                required
              />
            </div>

            <div className="add-course-group">
              <label htmlFor="description">Course Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Course Description"
                rows="4"
                required
              />
            </div>

            <div className="add-course-grid">
              <div className="add-course-group">
                <label htmlFor="skill">Skill</label>
                <select
                  id="skill"
                  name="skill"
                  value={formData.skill}
                  onChange={handleChange}
                  required
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Data">Data</option>
                </select>
              </div>

              <div className="add-course-group">
                <label htmlFor="level">Level</label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  required
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="add-course-group">
              <label htmlFor="skillTags">Tags (comma separated)</label>
              <input
                id="skillTags"
                name="skillTags"
                type="text"
                value={formData.skillTags}
                onChange={handleChange}
                placeholder="e.g. React, Node, MongoDB"
              />
            </div>

            <div className="add-course-actions">
              <button
                type="button"
                className="add-course-cancel"
                onClick={() => navigate("/courses")}
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="add-course-submit" disabled={loading}>
                {loading ? "Saving..." : "Add Course"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddCourse;
