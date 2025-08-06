import mongoose from 'mongoose';

const examResultSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  incorrectAnswers: {
    type: Number,
    required: true
  },
  skippedAnswers: {
    type: Number,
    required: true,
    default: 0
  },
  scorePercentage: {
    type: Number,
    required: true
  },
  timeTaken: {
    type: String, // Example: '105 min'
    required: true
  },
  status: {
    type: String,
    enum: ['PASSED', 'FAILED'],
    required: true
  },
  scoreDistribution: {
    correctPercentage: { type: Number, required: true },
    incorrectPercentage: { type: Number, required: true },
    skippedPercentage: { type: Number, required: true }
  },
}, {timestamps: true});

export default mongoose.models.ExamResult || mongoose.model('ExamResult', examResultSchema);