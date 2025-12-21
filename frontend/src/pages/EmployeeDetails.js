import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getEmployeeProfile } from "../api";

function EmployeeDetails() {
  const { userId } = useParams();
  const token = localStorage.getItem("token");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEmployeeProfile(userId, token)
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to load employee details");
        setLoading(false);
      });
  }, [userId, token]);

  if (loading) return <p style={{ padding: "20px" }}>Loading...</p>;
  if (!profile) return <p style={{ padding: "20px" }}>No profile found</p>;

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Employee Details</h2>

        <p><b>Name:</b> {profile.userId.name}</p>
        <p><b>Email:</b> {profile.userId.email}</p>
        <p><b>Skill Level:</b> {profile.skillLevel}</p>
        <p><b>Skills:</b> {profile.skills.join(", ")}</p>
        <p><b>Experience:</b> {profile.experience}</p>
      </div>
    </>
  );
}

export default EmployeeDetails;
