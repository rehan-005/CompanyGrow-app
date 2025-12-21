const mongoose = require("mongoose");

const employeeProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    skillLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },

    experience: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmployeeProfile", employeeProfileSchema);
