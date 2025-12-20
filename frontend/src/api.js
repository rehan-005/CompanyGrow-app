import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

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

export default API;
