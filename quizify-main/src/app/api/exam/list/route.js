import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ExamModel from "@/models/exam.model";
export async function GET() {
    try {
        await connectDB();
        const exams = await ExamModel.find({}).sort({ dateTime: -1 });
        return NextResponse.json({ 
            success: true, 
            message: "Exams fetched successfully", 
            exams: exams 
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching exams:", error);
        return NextResponse.json({ 
            success: false, 
            message: "Failed to fetch exams", 
            error: error.message 
        }, { status: 500 });
    }
};