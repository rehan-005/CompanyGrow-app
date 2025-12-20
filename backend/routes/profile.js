const express = require("express");
const EmployeeProfile = require("../models/employeeProfile");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * GET logged-in employee profile
 */
router.get("/", protect, async (req, res) => {
  const profile = await EmployeeProfile.findOne({ userId: req.user.id });
  res.json(profile); // null if not created
});

/**
 * CREATE or UPDATE employee profile
 */
router.post("/", protect, async (req, res) => {
  const { skills, experience } = req.body;

  let profile = await EmployeeProfile.findOne({ userId: req.user.id });

  if (profile) {
    profile.skills = skills;
    profile.experience = experience;
    await profile.save();
  } else {
    profile = await EmployeeProfile.create({
      userId: req.user.id,
      skills,
      experience,
    });
  }

  res.json(profile);
});

module.exports = router;
