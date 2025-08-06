import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ExamResultModel from "@/models/result.model.js";
import ExamModel from "@/models/exam.model.js";
import UserModel from "@/models/user.model.js";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions.js";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "You must be logged in to view certificates" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    
    // Get search params
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    
    // Find all passed exam results for this user
    const passedResults = await ExamResultModel.find({
      userId: userId,
      status: "PASSED"
    }).sort({ createdAt: -1 }).lean();

    // Get exam details for each result
    const certificates = await Promise.all(
      passedResults.map(async (result) => {
        const exam = await ExamModel.findById(result.examId).lean();
        
        if (!exam) {
          return null;
        }
        
        // Get user info - use email from session instead of querying by ID
        // This avoids ObjectId casting issues
        let userName = session.user.name || "Student";
        
        // Try to get user email if name is not available
        if (!userName && session.user.email) {
          userName = session.user.email.split('@')[0]; // Use part before @ as name
        }
        
        // Calculate certificate expiry (2 years from issue date)
        const issueDate = new Date(result.createdAt);
        const validUntil = new Date(issueDate);
        validUntil.setFullYear(validUntil.getFullYear() + 2);
        
        // Format the certificate data
        return {
          id: result._id.toString(),
          examId: result.examId.toString(),
          examTitle: exam.title,
          issueDate: issueDate.toISOString(),
          score: result.scorePercentage,
          validUntil: validUntil.toISOString(),
          userName: userName,
        };
      })
    );
    
    // Filter out any null values and apply search if present
    const filteredCertificates = certificates
      .filter(cert => cert !== null)
      .filter(cert => 
        search === "" || 
        cert.examTitle.toLowerCase().includes(search.toLowerCase())
      );

    return NextResponse.json({
      success: true,
      certificates: filteredCertificates,
    });
  } catch (error) {
    console.error("Error retrieving certificates:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to retrieve certificates",
      },
      { status: 500 }
    );
  }
}