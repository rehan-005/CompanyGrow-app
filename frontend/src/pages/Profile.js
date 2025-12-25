import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // get profile
      const profileRes = await API.get("/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // If no profile data, redirect to create profile
      if (!profileRes.data) {
        navigate('/create-profile');
        return;
      }
      
      setProfile(profileRes.data);
      
      // get user info from token storage
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // Profile not found, redirect to create profile
        navigate('/create-profile');
      } else {
        alert("Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!profile || !user) return null;

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="container">
          <div className="profile-card">
            <div className="profile-card-header">
              <div>
                <h2 className="profile-title">My Profile</h2>
                <p className="profile-subtitle">View and manage your professional details</p>
              </div>

              <button
                type="button"
                className="profile-edit-btn"
                onClick={() => navigate("/edit-profile")}
              >
                Edit Profile
              </button>
            </div>

            <div className="profile-section">
              <h3 className="profile-section-title">Account</h3>

              <div className="profile-grid">
                <div className="profile-field">
                  <span className="profile-label">Name</span>
                  <span className="profile-value">{user.name}</span>
                </div>

                <div className="profile-field">
                  <span className="profile-label">Email</span>
                  <span className="profile-value">{user.email}</span>
                </div>
              </div>
            </div>

            <div className="profile-divider" />

            <div className="profile-section">
              <h3 className="profile-section-title">Skills</h3>

              <div className="profile-grid">
                <div className="profile-field">
                  <span className="profile-label">Skill Level</span>
                  <span className="profile-value">
                    <span className={`profile-skill-level profile-skill-level--${(profile.skillLevel || "").toLowerCase()}`}>
                      {profile.skillLevel || "-"}
                    </span>
                  </span>
                </div>

                <div className="profile-field">
                  <span className="profile-label">Skills</span>
                  <span className="profile-value">
                    <span className="profile-skill-badges">
                      {(profile.skills || []).length > 0 ? (
                        profile.skills.map((s) => (
                          <span key={s} className="profile-skill-badge">
                            {s}
                          </span>
                        ))
                      ) : (
                        "-"
                      )}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-divider" />

            <div className="profile-section">
              <h3 className="profile-section-title">Experience</h3>
              <div className="profile-experience">
                {profile.experience && profile.experience.trim().length > 0
                  ? profile.experience
                  : "-"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
