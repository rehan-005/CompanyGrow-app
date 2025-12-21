const express = require("express");
const Project = require("../models/project");
const EmployeeProfile = require("../models/employeeProfile");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route   POST /api/projects
 * @desc    Create project & auto-assign best employee (Admin)
 */
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { title, description, requiredSkills } = req.body;

    if (!title || !requiredSkills || requiredSkills.length === 0) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Get all employee profiles
    const profiles = await EmployeeProfile.find()
      .populate({
        path: "userId",
        match: { role: "employee" },
        select: "name email role",
      })
      .then((profiles) => profiles.filter((p) => p.userId)); // remove admins

    let bestProfile = null;
    let bestScore = 0;

    profiles.forEach((profile) => {
      const employeeSkills = profile.skills.map((s) => s.toLowerCase());
      const projectSkills = requiredSkills.map((s) => s.toLowerCase());

      const matchedSkills = employeeSkills.filter((skill) =>
        projectSkills.includes(skill)
      );

      if (matchedSkills.length > bestScore) {
        bestScore = matchedSkills.length;
        bestProfile = profile;
      }
    });

    const project = await Project.create({
      title,
      description,
      requiredSkills,
      assignedTo: bestProfile ? bestProfile.userId._id : null,
      assignedBy: req.user.id,
      matchScore: bestScore,
      status: bestProfile ? "assigned" : "unassigned",
    });

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/projects
 * @desc    Get all projects
 */
router.get("/", protect, async (req, res) => {
  const projects = await Project.find()
    .populate("assignedTo", "name email")
    .populate("assignedBy", "name email");

  res.json(projects);
});

/**
 * @route   GET /api/projects/my
 * @desc    Get projects assigned to logged-in employee
 */
router.get("/my", protect, async (req, res) => {
  const projects = await Project.find({ assignedTo: req.user.id });
  res.json(projects);
});

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete a project (Admin only)
 */
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.deleteOne();

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
