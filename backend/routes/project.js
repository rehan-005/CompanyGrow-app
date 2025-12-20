const express = require("express");
const Project = require("../models/project");
const User = require("../models/user");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route   POST /api/projects
 * @desc    Create project & auto-assign best employee (Admin)
 */
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { title, requiredSkills } = req.body;

    if (!title || !requiredSkills || requiredSkills.length === 0) {
      return res.status(400).json({ message: "All fields required" });
    }

    const employees = await User.find({ role: "employee" });

    let bestEmployee = null;
    let bestScore = 0;

    employees.forEach((emp) => {
      const matchedSkills = emp.skills.filter((skill) =>
        requiredSkills.includes(skill)
      );

      if (matchedSkills.length > bestScore) {
        bestScore = matchedSkills.length;
        bestEmployee = emp;
      }
    });

    const project = await Project.create({
      title,
      requiredSkills,
      assignedTo: bestEmployee ? bestEmployee._id : null,
      matchScore: bestScore,
      status: bestEmployee ? "assigned" : "unassigned",
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/projects
 * @desc    Get all projects
 */
router.get("/", protect, async (req, res) => {
  const projects = await Project.find().populate("assignedTo", "name skills");
  res.json(projects);
});

module.exports = router;
