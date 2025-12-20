import { useEffect, useState } from "react";
import API from "../api";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/Navbar";
import "./Courses.css";
import "../App.css";

function Courses() {
  const [courses, setCourses] = useState([]);
  const token = localStorage.getItem("token");

  // get logged-in user id from token
  const userId = token ? jwtDecode(token).id : null;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await API.get("/courses");
      setCourses(res.data);
    } catch (err) {
      alert("Failed to load courses");
    }
  };

  const enrollCourse = async (courseId) => {
    try {
      await API.post(
        `/courses/${courseId}/enroll`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Enrolled successfully");
      fetchCourses(); // refresh list
    } catch (err) {
      alert(err.response?.data?.message || "Enrollment failed");
    }
  };

  const cancelEnrollment = async (courseId) => {
    try {
      await API.delete(`/courses/${courseId}/enroll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

        {courses.map((course) => {
          const alreadyEnrolled = course.enrolledUsers?.some(
            (uid) => uid === userId
          );

          return (
            <div key={course._id} className="course-card">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p>
                <b>Skills:</b> {course.skillTags.join(", ")}
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
