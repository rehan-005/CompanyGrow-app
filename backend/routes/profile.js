const express = require("express");
const EmployeeProfile = require("../models/employeeProfile");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * GET logged-in employee profile
 * @route GET /api/profile
 */
router.get("/", protect, async (req, res) => {
  const profile = await EmployeeProfile.findOne({ userId: req.user.id });
  res.json(profile);
});

/**
 * CREATE or UPDATE employee profile
 * @route POST /api/profile
 */
router.post("/", protect, async (req, res) => {
  try {
    const { skills, skillLevel, experience } = req.body;

    if (!skillLevel) {
      return res.status(400).json({ message: "Skill level is required" });
    }

    let profile = await EmployeeProfile.findOne({ userId: req.user.id });

    if (profile) {
      profile.skills = skills;
      profile.skillLevel = skillLevel;
      profile.experience = experience;
      await profile.save();
    } else {
      profile = await EmployeeProfile.create({
        userId: req.user.id,
        skills,
        skillLevel,
        experience,
      });
    }

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET employee profile by userId (Admin use)
 * @route GET /api/profile/:userId
 */
router.get("/:userId", protect, async (req, res) => {
  try {
    const profile = await EmployeeProfile.findOne({
      userId: req.params.userId,
    }).populate("userId", "name email");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
