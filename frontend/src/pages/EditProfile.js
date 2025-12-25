import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";
import "./CreateProfile.css";
import "./EditProfile.css";

function EditProfile() {
  const [formData, setFormData] = useState({
    skills: "",
    skillLevel: "Beginner",
    experience: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileRes = await API.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profile = profileRes.data;

        if (!profile) {
          navigate("/create-profile");
          return;
        }

        setFormData({
          skills: (profile.skills || []).join(", "),
          skillLevel: profile.skillLevel || "Beginner",
          experience: profile.experience || "",
        });
      } catch (err) {
        if (err.response && err.response.status === 404) {
          navigate("/create-profile");
        } else {
          setError("Failed to load profile. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await API.post(
        "/profile",
        {
          skills: formData.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          skillLevel: formData.skillLevel,
          experience: formData.experience,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="edit-profile-container">
          <div className="edit-profile-form">
            <h2>Edit Your Profile</h2>
            <p className="edit-profile-loading">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="edit-profile-container">
      <Navbar />
      <div className="edit-profile-form">
        <h2>Edit Your Profile</h2>

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

          <div className="edit-profile-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/profile")}
              disabled={saving}
            >
              Cancel
            </button>

            <button type="submit" disabled={saving} className="submit-btn">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
