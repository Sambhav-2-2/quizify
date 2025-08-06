// This handles GET /api/exam/[id] to fetch a single exam

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db.js";
import ExamModel from "@/models/exam.model.js";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const id = await params.id;

    const exam = await ExamModel.findById(id);
    
    if (!exam) {
      return NextResponse.json({ 
        success: false, 
        message: "Exam not found" 
      }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, exam });
  } catch (error) {
    console.error("Error fetching exam:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to fetch exam" 
    }, { status: 500 });
  }
}