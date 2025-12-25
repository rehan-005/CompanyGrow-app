import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";
import "./CreateProfile.css";

function CreateProfile() {
  const [formData, setFormData] = useState({
    skills: "",
    skillLevel: "Beginner",
    experience: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await API.post(
        "/profile",
        {
          skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
          skillLevel: formData.skillLevel,
          experience: formData.experience
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      navigate("/profile");
    } catch (err) {
      console.error("Profile creation error:", err);
      setError(
        err.response?.data?.message || "Failed to create profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-profile-container">
      <Navbar />
      <div className="create-profile-form">
        <h2>Create Your Profile</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="skills">Skills (comma separated)</label>
            <input
              id="skills"
              name="skills"
              type="text"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. JavaScript, React, Node.js"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="skillLevel">Skill Level</label>
            <select
              id="skillLevel"
              name="skillLevel"
              value={formData.skillLevel}
              onChange={handleChange}
              required
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="experience">Experience</label>
            <textarea
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Briefly describe your experience..."
              rows="4"
            />
          </div>
          
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateProfile;
