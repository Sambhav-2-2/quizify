import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ExamResultModel from "@/models/result.model.js";
import ExamModel from "@/models/exam.model.js";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions.js";
import jsPDF from "jspdf";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "You must be logged in to download certificates" },
        { status: 401 }
      );
    }
    const params2 = await params;
    const certificateId = params2.id;
    
    // Find the specific exam result
    const result = await ExamResultModel.findById(certificateId).lean();
    
    if (!result) {
      return NextResponse.json(
        { success: false, message: "Certificate not found" },
        { status: 404 }
      );
    }
    
    // Check that this certificate belongs to the logged-in user
    if (result.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "You do not have permission to download this certificate" },
        { status: 403 }
      );
    }
    
    // Check that the exam was passed
    if (result.status !== "PASSED") {
      return NextResponse.json(
        { success: false, message: "Cannot generate certificate for failed exam" },
        { status: 400 }
      );
    }
    
    // Get exam data
    const exam = await ExamModel.findById(result.examId).lean();
    
    if (!exam) {
      return NextResponse.json(
        { success: false, message: "Exam not found" },
        { status: 404 }
      );
    }
    
    // Create PDF document
    const pdfBuffer = await generateCertificatePDF({
      userName: session.user.name || "Student",
      examTitle: exam.title,
      score: result.scorePercentage,
      date: new Date(result.createdAt).toLocaleDateString(),
      certificateId: result._id.toString()
    });
    
    // Create Response with PDF
    const response = new NextResponse(pdfBuffer);
    
    // Set headers for PDF download
    response.headers.set("Content-Type", "application/pdf");
    response.headers.set("Content-Disposition", `attachment; filename=certificate-${certificateId}.pdf`);
    
    return response;
    
  } catch (error) {
    console.error("Error generating certificate:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to generate certificate",
      },
      { status: 500 }
    );
  }
}

// Function to generate PDF certificate with jsPDF
async function generateCertificatePDF({ userName, examTitle, score, date, certificateId }) {
  // Create a new jsPDF instance in landscape orientation
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });
  
  // Get page dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Add border
  doc.setLineWidth(0.5);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  doc.setLineWidth(0.2);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);
  
  // Add header
  doc.setFontSize(30);
  doc.setFont('helvetica', 'bold');
  doc.text("CERTIFICATE OF ACHIEVEMENT", pageWidth / 2, 40, { align: 'center' });
  doc.setLineWidth(0.2);
  doc.line(pageWidth / 2 - 80, 45, pageWidth / 2 + 80, 45);
  
  // Certificate text
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text("This is to certify that", pageWidth / 2, 70, { align: 'center' });
  
  // Student name
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(userName, pageWidth / 2, 85, { align: 'center' });
  
  // Completion text
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text("has successfully completed", pageWidth / 2, 100, { align: 'center' });
  
  // Exam name
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(examTitle, pageWidth / 2, 115, { align: 'center' });
  
  // Score
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text(`with a score of ${score}%`, pageWidth / 2, 130, { align: 'center' });
  
  // Date
  doc.setFontSize(14);
  doc.text(`Issued on: ${date}`, pageWidth / 2, 150, { align: 'center' });
  
  // Certificate ID
  doc.setFontSize(10);
  doc.text(`Certificate ID: ${certificateId}`, pageWidth / 2, 160, { align: 'center' });
  
  // Verification text
  doc.text("This certificate is only valid when presented with proper identification.", pageWidth / 2, 170, { align: 'center' });
  
  // Signature line
  doc.setLineWidth(0.2);
  doc.line(pageWidth / 2 - 40, 185, pageWidth / 2 + 40, 185);
  doc.setFontSize(10);
  doc.text("Authorized Signature", pageWidth / 2, 190, { align: 'center' });
  
  // Convert the PDF to bytes
  const pdfBytes = doc.output('arraybuffer');
  return Buffer.from(pdfBytes);
}