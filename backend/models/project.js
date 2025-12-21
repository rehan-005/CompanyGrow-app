const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    // Skills required to do this project
    requiredSkills: {
      type: [String], // ["React", "Node"]
      required: true,
    },

    // Assigned employee
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Admin who assigned
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ✅ How many skills matched
    matchScore: {
      type: Number,
      default: 0,
    },

    // ✅ Assignment status
    status: {
      type: String,
      enum: ["assigned", "unassigned"],
      default: "unassigned",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
