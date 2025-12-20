import { useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/Navbar";
import { getCourses, enrollInCourse, cancelEnroll } from "../api";
import "./Courses.css";
import "../App.css";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [skill, setSkill] = useState("");
  const [level, setLevel] = useState("");

  const token = localStorage.getItem("token");
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

  return (
    <>
      <Navbar />

      <div className="container">
        <h2>Available Courses</h2>

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

              {alreadyEnrolled ? (
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
          );
        })}
      </div>
    </>
  );
}

export default Courses;
