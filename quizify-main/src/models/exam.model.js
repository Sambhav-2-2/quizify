import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    dateTime: {
      type: Date,
      required: [true, "Exam date and time are required"],
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [1, "Duration must be at least 1 minute"],
    },
    totalQuestions: {
      type: Number,
      required: [true, "Total questions are required"],
      min: [1, "There must be at least 1 question"],
    },
    category: {
      type: String,
      trim: true,
      default: "General",
    },
  },
  { timestamps: true }
);

const ExamModel = mongoose.models.Exam || mongoose.model("Exam", examSchema);

export default ExamModel;
