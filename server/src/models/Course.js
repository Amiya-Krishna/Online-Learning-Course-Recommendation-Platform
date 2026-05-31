const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 1200,
    },
    instructor: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    thumbnail: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    tags: {
      type: [String],
      default: [],
      set: (values) => values.map((value) => value.trim().toLowerCase()),
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    durationInHours: {
      type: Number,
      default: 0,
      min: 0,
    },
    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
    },
  }
);

courseSchema.index({ category: 1, createdAt: -1 });
courseSchema.index({ tags: 1 });
courseSchema.index({ title: "text", description: "text", instructor: "text" });

courseSchema.virtual("enrolledCount").get(function enrolledCount() {
  return this.studentsEnrolled.length;
});

module.exports = mongoose.model("Course", courseSchema);
