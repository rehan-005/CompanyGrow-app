const User = require("../models/user"); // or User.js if capital U
const { protect, adminOnly } = require("../middleware/authMiddleware");
const express = require("express");
const Course = require("../models/course");
const router = express.Router();

/**
 * @route   POST /api/courses
 * @desc    Create a course (Admin)
 */

router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { title, description, skillTags } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "All fields required" });
    }

    const course = await Course.create({
      title,
      description,
      skillTags,
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/courses
 * @desc    Get all courses
 */
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   POST /api/courses/:id/enroll
 * @desc    Enroll logged-in employee in a course
 */
router.post("/:id/enroll", protect, async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Prevent duplicate enrollment
    const alreadyEnrolled = course.enrolledUsers.some(
      (id) => id.toString() === userId
    );

    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    course.enrolledUsers.push(userId);
    await course.save();

    res.json({ message: "Enrolled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   DELETE /api/courses/:id/enroll
 * @desc    De-enroll logged-in employee from a course
 */
router.delete("/:id/enroll", protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Remove user from enrolledUsers
    course.enrolledUsers = course.enrolledUsers.filter(
      (userId) => userId.toString() !== req.user.id
    );

    await course.save();

    res.json({ message: "De-enrolled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
