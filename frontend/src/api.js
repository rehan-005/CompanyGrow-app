import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ================= COURSES =================

// Get courses with optional filters
export const getCourses = (skill, level) => {
  return API.get("/courses", {
    params: {
      skill: skill || undefined,
      level: level || undefined,
    },
  });
};

// Enroll course
export const enrollInCourse = (courseId, token) => {
  return API.post(
    `/courses/${courseId}/enroll`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Cancel enrollment
export const cancelEnroll = (courseId, token) => {
  return API.delete(`/courses/${courseId}/enroll`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ================= PROJECTS =================

// Admin: get all projects
export const getAllProjects = (token) => {
  return API.get("/projects", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Employee: get my assigned projects
export const getMyProjects = (token) => {
  return API.get("/projects/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Admin: get employee profile by userId
export const getEmployeeProfile = (userId, token) => {
  return API.get(`/profile/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Admin: delete project
export const deleteProject = (projectId, token) => {
  return API.delete(`/projects/${projectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};



export default API;
