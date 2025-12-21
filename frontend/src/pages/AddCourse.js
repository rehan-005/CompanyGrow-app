import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";

function AddCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skill, setSkill] = useState("Frontend");      // ✅
  const [level, setLevel] = useState("Beginner");      // ✅
  const [skillTags, setSkillTags] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleAdd = async () => {
    try {
      await API.post(
        "/courses",
        {
          title,
          description,
          skill,
          level,
          skillTags: skillTags.split(",").map(t => t.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Course added successfully");
      navigate("/courses"); // ✅ redirect after add
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add course");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Add Course</h2>

        {/* TITLE */}
        <input
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Course Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* ✅ SKILL SELECT */}
        <select value={skill} onChange={(e) => setSkill(e.target.value)}>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="Data">Data</option>
        </select>

        {/* ✅ LEVEL SELECT */}
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        {/* TAGS */}
        <input
          placeholder="Tags (comma separated)"
          value={skillTags}
          onChange={(e) => setSkillTags(e.target.value)}
        />

        <button onClick={handleAdd}>Add Course</button>
      </div>
    </>
  );
}

export default AddCourse;
