import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ExamResultModel from "@/models/result.model.js";
import ExamModel from "@/models/exam.model.js";  // Make sure to import this
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions.js";

export async function GET(request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "You must be logged in to view results" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const resultId = searchParams.get("resultId");
    const examId = searchParams.get("examId");
    
    if (!resultId && !examId) {
      return NextResponse.json(
        { success: false, message: "Either resultId or examId is required" },
        { status: 400 }
      );
    }

    let query = { userId: session.user.id };
    
    if (resultId) {
      if (!mongoose.Types.ObjectId.isValid(resultId)) {
        return NextResponse.json(
          { success: false, message: "Invalid resultId format" },
          { status: 400 }
        );
      }
      query._id = resultId;
    } else if (examId) {
      if (!mongoose.Types.ObjectId.isValid(examId)) {
        return NextResponse.json(
          { success: false, message: "Invalid examId format" },
          { status: 400 }
        );
      }
      query.examId = examId;
    }

    const examResult = await ExamResultModel.findOne(query).lean();

    if (!examResult) {
      return NextResponse.json(
        { success: false, message: "Exam result not found" },
        { status: 404 }
      );
    }

    // Get exam details
    const exam = await ExamModel.findById(examResult.examId).lean();
    
    // Format the response
    const result = {
      id: examResult._id.toString(),
      title: exam?.title || "Unknown Exam",
      date: examResult.createdAt,
      totalQuestions: examResult.totalQuestions,
      correctAnswers: examResult.correctAnswers,
      incorrectAnswers: examResult.incorrectAnswers,
      skippedQuestions: examResult.skippedAnswers,
      score: examResult.scorePercentage,
      passingScore: 70, // You might want to store this in the exam model
      timeTaken: examResult.timeTaken,
      passed: examResult.status === "PASSED",
      status: examResult.status,
      scoreDistribution: examResult.scoreDistribution,
    };

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving exam result:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to retrieve exam result",
      },
      { status: 500 }
    );
  }
}