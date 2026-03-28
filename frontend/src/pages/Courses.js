import { useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { getCourses, enrollInCourse, cancelEnroll, deleteCourse } from "../api";
import "./Courses.css";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [skill, setSkill] = useState("");
  const [level, setLevel] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [enrollingId, setEnrollingId] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = storedUser?.role === "admin";
  const userId = token ? jwtDecode(token).id : null;

  const fetchCourses = useCallback(async () => {
    try {
      const res = await getCourses(skill, level);
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to load courses:", err);
    }
  }, [skill, level]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);
  
  useEffect(() => {
    setSkill("");
    setLevel("");
  }, []);

  const enrollCourse = async (courseId) => {
    try {
      setEnrollingId(courseId);
      await enrollInCourse(courseId, token);
      fetchCourses();
    } catch (err) {
      console.error("Enrollment failed:", err);
    } finally {
      setEnrollingId(null);
    }
  };

  const cancelEnrollment = async (courseId) => {
    try {
      setEnrollingId(courseId);
      await cancelEnroll(courseId, token);
      fetchCourses();
    } catch (err) {
      console.error("Cancel failed:", err);
    } finally {
      setEnrollingId(null);
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
      console.error("Failed to delete course:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="courses-container">
      <div className="courses-header">
        <div className="header-content">
          <h1>Learning Path</h1>
          <p>Discover and enroll in courses to advance your skills</p>
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-header">
          <h3>Filter Courses</h3>
        </div>
        <div className="filter-controls">
          <div className="filter-group">
            <label>Skill</label>
            <select value={skill} onChange={(e) => setSkill(e.target.value)}>
              <option value="">All Skills</option>
              <option value="Frontend">🎨 Frontend</option>
              <option value="Backend">⚙️ Backend</option>
              <option value="Data">📊 Data</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Level</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="">All Levels</option>
              <option value="Beginner">🌱 Beginner</option>
              <option value="Intermediate">🚀 Intermediate</option>
              <option value="Advanced">💪 Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No courses found</h3>
          <p>Try adjusting your filters or check back later for new courses.</p>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => {
            const alreadyEnrolled = course.enrolledUsers?.some(
              (uid) => uid === userId
            );

            return (
              <div key={course._id} className="course-card">
                <div className="course-header">
                  <h3>{course.title}</h3>
                  <span className={`level-badge ${course.level.toLowerCase()}`}>
                    {course.level}
                  </span>
                </div>
                
                <p className="course-description">{course.description}</p>

                <div className="course-meta">
                  <div className="meta-item">
                    <span className="meta-icon">🏷️</span>
                    <span>{course.skill}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">👥</span>
                    <span>{course.enrolledUsers?.length || 0} enrolled</span>
                  </div>
                </div>

                <div className="course-tags">
                  {course.skillTags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="course-actions">
                  {isAdmin ? (
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteCourse(course._id)}
                      disabled={deletingId === course._id}
                    >
                      {deletingId === course._id ? (
                        <>
                          <span className="spinner"></span>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <span>🗑️</span>
                          Delete
                        </>
                      )}
                    </button>
                  ) : alreadyEnrolled ? (
                    <button
                      className="cancel-btn"
                      onClick={() => cancelEnrollment(course._id)}
                      disabled={enrollingId === course._id}
                    >
                      {enrollingId === course._id ? (
                        <>
                          <span className="spinner"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <span>❌</span>
                          Cancel Enrollment
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      className="enroll-btn"
                      onClick={() => enrollCourse(course._id)}
                      disabled={enrollingId === course._id}
                    >
                      {enrollingId === course._id ? (
                        <>
                          <span className="spinner"></span>
                          Enrolling...
                        </>
                      ) : (
                        <>
                          <span>✅</span>
                          Enroll Now
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Courses;
