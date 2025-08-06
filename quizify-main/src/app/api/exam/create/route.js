import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ExamModel from "@/models/exam.model";

export async function POST(request) {
    try {
        const formData = await request.formData();
        const title = formData.get("title");
        const description = formData.get("description");
        const dateTime = formData.get("dateTime");
        const duration = formData.get("duration");
        const totalQuestions = formData.get("totalQuestions");
        const category = formData.get("category");
        
        console.log("Exam creation attempt:", { title, description, dateTime, duration, totalQuestions, category });

        if (!title || !description || !dateTime || !duration || !totalQuestions) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const connection = await connectDB();
        const newExam = await ExamModel.create({
            title,
            description,
            dateTime,
            duration,
            totalQuestions,
            category,
        });

        return NextResponse.json({ success: true, message: "Exam created successfully", exam: newExam }, { status: 201 });
        
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
};

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