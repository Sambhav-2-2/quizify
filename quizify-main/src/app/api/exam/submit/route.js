import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ExamQuestionsModel from "@/models/question.model.js";
import ExamResultModel from "@/models/result.model.js";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions.js";

export async function POST(request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "You must be logged in to submit an exam" },
        { status: 401 }
      );
    }
    const data = await request.json();

    if (!data.examId || !mongoose.Types.ObjectId.isValid(data.examId)) {
      return NextResponse.json(
        { success: false, message: "Valid Exam ID is required" },
        { status: 400 }
      );
    }

    if (!data.answers || typeof data.answers !== "object") {
      return NextResponse.json(
        { success: false, message: "Answers are required" },
        { status: 400 }
      );
    }

    const examQuestions = await ExamQuestionsModel.findOne({
      examId: data.examId,
    });

    if (!examQuestions) {
      return NextResponse.json(
        { success: false, message: "Exam not found" },
        { status: 404 }
      );
    }

    const questions = examQuestions.questions;
    const totalQuestions = questions.length;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    const questionResults = [];

    // For each question in the exam
    questions.forEach((question, index) => {
      // Check if user answered this question
      const userAnswer = data.answers[index];
      let isCorrect = false;
      let correctOptionIndex = -1;

      // Find the correct option index
      question.options.forEach((option, optIndex) => {
        if (option.isCorrect) {
          correctOptionIndex = optIndex;
        }
      });

      // If the question was answered
      if (userAnswer && userAnswer.selectedOption !== undefined) {
        // Check if user's answer is correct
        if (userAnswer.selectedOption === correctOptionIndex) {
          isCorrect = true;
          correctAnswers++;
        } else {
          incorrectAnswers++;
        }
      }

      // Record this question's result
      questionResults.push({
        questionIndex: index,
        question: question.text,
        userSelectedOption: userAnswer ? userAnswer.selectedOption : null,
        correctOptionIndex,
        isCorrect,
      });
    });

    // Calculate skipped questions
    const skippedAnswers = totalQuestions - (correctAnswers + incorrectAnswers);

    // Calculate score percentage
    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

    // Format time taken
    const timeInSeconds = data.timeSpent || 0;
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    const timeTaken = `${minutes} min ${seconds} sec`;

    // Determine pass/fail status (70% is passing)
    const status = scorePercentage >= 70 ? "PASSED" : "FAILED";

    // Calculate score distribution
    const scoreDistribution = {
      correctPercentage: Math.round((correctAnswers / totalQuestions) * 100),
      incorrectPercentage: Math.round(
        (incorrectAnswers / totalQuestions) * 100
      ),
      skippedPercentage: Math.round((skippedAnswers / totalQuestions) * 100),
    };

    // Create the result document
    const examResult = new ExamResultModel({
      examId: data.examId,
      userId: session.user.id,
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      skippedAnswers,
      scorePercentage,
      timeTaken,
      status,
      scoreDistribution,
    });

    // Save the result to the database
    await examResult.save();

    // Prepare response
    const result = {
      success: true,
      resultId: examResult._id,
      examId: data.examId,
      redirectUrl: `/dashboard/exams/${data.examId}/results`,
      score: {
        correct: correctAnswers,
        incorrect: incorrectAnswers,
        skipped: skippedAnswers,
        total: totalQuestions,
        percentage: scorePercentage,
      },
      timeTaken,
      status,
      questionResults,
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error processing exam submission:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to process exam submission",
      },
      { status: 500 }
    );
  }
}
