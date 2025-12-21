import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";

function CreateProfile() {
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSave = async () => {
    try {
      await API.post(
        "/profile",
        {
          skills: skills.split(",").map((s) => s.trim()),
          experience,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Profile created successfully");
      navigate("/courses");
    } catch (err) {
      alert("Failed to create profile");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Create Employee Profile</h2>

        <input
          placeholder="Skills (comma separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        <input
          placeholder="Experience (e.g. Fresher, 2 years)"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />

        <button onClick={handleSave}>Save Profile</button>
      </div>
    </>
  );
}

export default CreateProfile;
