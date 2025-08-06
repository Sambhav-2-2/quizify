import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ExamQuestionsModel from "@/models/question.model.js";
import mongoose from "mongoose";

export async function POST(request) {
  try {
    await connectDB();

    // Parse the JSON request
    const data = await request.json();
    console.log("Received data:", data); // Debug log

    // Validate exam ID
    if (!data.examId || !mongoose.Types.ObjectId.isValid(data.examId)) {
      return NextResponse.json(
        { success: false, message: "Valid Exam ID is required" },
        { status: 400 }
      );
    }

    // Validate question with better validation
    if (!data.text || data.text.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Question text is required" },
        { status: 400 }
      );
    }

    // Validate options
    if (
      !data.options ||
      !Array.isArray(data.options) ||
      data.options.length < 2
    ) {
      return NextResponse.json(
        { success: false, message: "At least two options are required" },
        { status: 400 }
      );
    }

    // Check for at least one correct answer
    const hasCorrectOption = data.options.some(
      (option) => option.isCorrect === true
    );
    if (!hasCorrectOption) {
      return NextResponse.json(
        {
          success: false,
          message: "At least one option must be marked as correct",
        },
        { status: 400 }
      );
    }

    // Format options to ensure they match schema
    const formattedOptions = data.options.map((option) => ({
      text: option.text,
      isCorrect: Boolean(option.isCorrect),
    }));

    // Create question object according to schema
    // Make sure to use the EXACT field names required by your schema
    // In route.js
    const newQuestion = {
      text: data.text.trim(), // Changed from questionText to text
      options: formattedOptions,
    };

    console.log("Question to be saved:", newQuestion); // Debug log

    // Check if document exists first
    let examQuestions = await ExamQuestionsModel.findOne({
      examId: data.examId,
    });

    if (!examQuestions) {
      // Create new document with initial questions array
      examQuestions = await ExamQuestionsModel.create({
        examId: data.examId,
        questions: [newQuestion],
      });
    } else {
      // Update existing document with explicit schema match
      const update = { $push: { questions: newQuestion } };
      const options = { new: true, runValidators: true };

      examQuestions = await ExamQuestionsModel.findOneAndUpdate(
        { examId: data.examId },
        update,
        options
      );
    }

    // Safely access questions length
    const questionCount = examQuestions?.questions?.length || 0;

    return NextResponse.json(
      {
        success: true,
        message: "Question added successfully",
        examId: data.examId,
        questionCount: questionCount,
        newQuestion: newQuestion,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding question:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const examId = searchParams.get("examId");

    if (!examId || !mongoose.Types.ObjectId.isValid(examId)) {
      return NextResponse.json(
        { success: false, message: "Valid Exam ID is required" },
        { status: 400 }
      );
    }

    // Find questions document for the given exam
    const examQuestions = await ExamQuestionsModel.findOne({ examId });

    if (!examQuestions) {
      return NextResponse.json(
        {
          success: true,
          examId: examId,
          count: 0,
          questions: [],
        },
        { status: 200 }
      );
    }

    // Safely access questions array in GET as well
    const questions = examQuestions.questions || [];

    return NextResponse.json(
      {
        success: true,
        examId: examId,
        count: questions.length,
        questions: questions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to retrieve questions",
      },
      { status: 500 }
    );
  }
}
