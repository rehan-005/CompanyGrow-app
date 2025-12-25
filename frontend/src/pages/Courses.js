import { useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getCourses, enrollInCourse, cancelEnroll, deleteCourse } from "../api";
import "./Courses.css";
import "../App.css";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [skill, setSkill] = useState("");
  const [level, setLevel] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = storedUser?.role === "admin";
  const userId = token ? jwtDecode(token).id : null;

  // ✅ FIX: wrap in useCallback
  const fetchCourses = useCallback(async () => {
    try {
      const res = await getCourses(skill, level);
      setCourses(res.data);
    } catch (err) {
      alert("Failed to load courses");
    }
  }, [skill, level]);

  // ✅ Now ESLint is satisfied
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);
  
  useEffect(() => {
    setSkill("");
    setLevel("");
  }, []);

  const enrollCourse = async (courseId) => {
    try {
      await enrollInCourse(courseId, token);
      alert("Enrolled successfully");
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || "Enrollment failed");
    }
  };

  const cancelEnrollment = async (courseId) => {
    try {
      await cancelEnroll(courseId, token);
      alert("Enrollment cancelled");
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || "Cancel failed");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!isAdmin) return;
    const ok = window.confirm("Delete this course?");
    if (!ok) return;

    try {
      setDeletingId(courseId);
      await deleteCourse(courseId, token);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete course");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <h2>Available Courses</h2>

        {isAdmin && (
          <div className="admin-course-toolbar">
            <button
              type="button"
              className="admin-add-course-btn"
              onClick={() => navigate("/admin/add-course")}
            >
              Add Course
            </button>
          </div>
        )}

        {/* FILTER BAR */}
        <div className="filter-bar">
          <select value={skill} onChange={(e) => setSkill(e.target.value)}>
            <option value="">All Skills</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Data">Data</option>
          </select>

          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {courses.length === 0 && <p>No courses found</p>}

        {courses.map((course) => {
          const alreadyEnrolled = course.enrolledUsers?.some(
            (uid) => uid === userId
          );

          return (
            <div key={course._id} className="course-card">
              <h3>{course.title}</h3>
              <p>{course.description}</p>

              <p>
                <b>Skill:</b> {course.skill} | <b>Level:</b> {course.level}
              </p>

              <p>
                <b>Tags:</b> {course.skillTags.join(", ")}
              </p>

              <div className="course-actions">
                {isAdmin ? (
                  <button
                    type="button"
                    className="delete-course-btn"
                    onClick={() => handleDeleteCourse(course._id)}
                    disabled={deletingId === course._id}
                  >
                    {deletingId === course._id ? "Deleting..." : "Delete"}
                  </button>
                ) : alreadyEnrolled ? (
                  <button
                    className="enroll-btn"
                    style={{ backgroundColor: "#e74c3c" }}
                    onClick={() => cancelEnrollment(course._id)}
                  >
                    Cancel Enrollment
                  </button>
                ) : (
                  <button
                    className="enroll-btn"
                    onClick={() => enrollCourse(course._id)}
                  >
                    Enroll
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Courses;
