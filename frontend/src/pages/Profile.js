import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";

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
      <div className="container">
        <h2>My Profile</h2>

        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Skill Level:</b> {user.skillLevel}</p>

        <hr />

        <p><b>Skills:</b> {profile.skills.join(", ")}</p>
        <p><b>Experience:</b> {profile.experience}</p>
      </div>
    </>
  );
}

export default Profile;
