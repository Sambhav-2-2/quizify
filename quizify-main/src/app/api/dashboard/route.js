import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ExamModel from "@/models/exam.model.js";
import ExamResultModel from "@/models/result.model.js";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions.js";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get all exam results for this user
    const examResults = await ExamResultModel.find({ userId }).lean();
    
    // Get all upcoming exams
    const now = new Date();
    const upcomingExams = await ExamModel.find({
      startDate: { $gt: now },
      published: true,
    })
      .sort({ startDate: 1 })
      .limit(10)
      .lean();

    // Calculate statistics
    const totalExams = examResults.length;
    const passedExams = examResults.filter(result => result.status === "PASSED").length;
    
    // Calculate average score
    let averageScore = 0;
    if (totalExams > 0) {
      averageScore = Math.round(
        examResults.reduce((sum, result) => sum + result.scorePercentage, 0) / totalExams
      );
    }
    
    // Format recent exams
    const recentExams = examResults
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(async (result) => {
        const exam = await ExamModel.findById(result.examId).lean();
        return {
          id: result._id.toString(),
          examId: result.examId.toString(),
          title: exam ? exam.title : "Unknown Exam",
          date: result.createdAt,
          score: result.scorePercentage,
          passed: result.status === "PASSED",
        };
      });
    
    // Wait for all the async operations in the map to complete
    const resolvedRecentExams = await Promise.all(recentExams);

    // Format upcoming exams
    const formattedUpcomingExams = upcomingExams.map(exam => ({
      id: exam._id.toString(),
      title: exam.title,
      date: exam.startDate,
      duration: exam.duration || 60,
    }));

    // Get data for subject performance chart
    const subjectPerformance = [];
    const uniqueExams = [...new Set(examResults.map(result => result.examId.toString()))];
    
    for (const examId of uniqueExams) {
      const exam = await ExamModel.findById(examId).lean();
      if (exam) {
        const results = examResults.filter(r => r.examId.toString() === examId);
        const avgScore = Math.round(
          results.reduce((sum, r) => sum + r.scorePercentage, 0) / results.length
        );
        
        subjectPerformance.push({
          name: exam.title,
          score: avgScore
        });
      }
    }

    // Get data for performance over time
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyPerformance = [];
    
    // Get results from the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const recentMonthlyResults = examResults.filter(
      result => new Date(result.createdAt) >= sixMonthsAgo
    );

    // Group results by month
    const resultsByMonth = {};
    recentMonthlyResults.forEach(result => {
      const date = new Date(result.createdAt);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      
      if (!resultsByMonth[monthKey]) {
        resultsByMonth[monthKey] = [];
      }
      
      resultsByMonth[monthKey].push(result);
    });

    // Calculate average score for each month
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthName = months[date.getMonth()];
      
      let score = 0;
      if (resultsByMonth[monthKey] && resultsByMonth[monthKey].length > 0) {
        score = Math.round(
          resultsByMonth[monthKey].reduce((sum, result) => sum + result.scorePercentage, 0) / 
          resultsByMonth[monthKey].length
        );
      }
      
      monthlyPerformance.unshift({
        month: monthName,
        score: score
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalExams,
          passedExams,
          averageScore,
          upcomingExamCount: formattedUpcomingExams.length,
          nextExamDate: formattedUpcomingExams[0]?.date || null,
        },
        recentExams: resolvedRecentExams,
        upcomingExams: formattedUpcomingExams,
        performance: {
          bySubject: subjectPerformance.slice(0, 5), // Limit to top 5
          overTime: monthlyPerformance,
          passFail: {
            passed: passedExams,
            failed: totalExams - passedExams,
          },
        },
      },
    });
  } catch (error) {
    console.error("Dashboard data error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}