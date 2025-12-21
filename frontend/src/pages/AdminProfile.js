import Navbar from "../components/Navbar";

function AdminProfile() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Admin Profile</h2>

        <p><b>Name:</b> {user?.name}</p>
        <p><b>Email:</b> {user?.email}</p>
        <p><b>Role:</b> Admin</p>
      </div>
    </>
  );
}

export default AdminProfile;
