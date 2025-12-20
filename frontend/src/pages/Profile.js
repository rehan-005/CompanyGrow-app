import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

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
      setProfile(profileRes.data);

      // get user info from token storage
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
    } catch (err) {
      alert("Failed to load profile");
    }
  };

  if (!profile || !user) return <p>Loading...</p>;

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
