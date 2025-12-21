const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    // ✅ NEW: main skill category
    skill: {
      type: String, // Frontend, Backend, Data
      required: true,
    },

    // ✅ NEW: difficulty level
    level: {
      type: String, // Beginner, Intermediate, Advanced
      required: true,
    },

     // Interest tags (already used)
    skillTags: {
      type: [String],
      default: [],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Enrollment already implemented
    enrolledUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
