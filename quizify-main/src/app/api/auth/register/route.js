import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import UserModel from "@/models/user.model";

// Use the correct App Router syntax for the POST handler
export async function POST(request) {
  try {
    // Parse form data
    const formData = await request.formData();
    
    // Extract form fields
    const username = formData.get("username");
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const accountType = formData.get("accountType") || "student";
    const avatarUrl = formData.get("avatarUrl"); // Get the Cloudinary URL from form data
    
    console.log("Registration attempt:", { name, email, accountType }); // Add logging
    
    // Simple validation
    if (!name || !email || !password || !username) {
      return NextResponse.json({ 
        success: false, 
        message: "Missing required fields" 
      }, { status: 400 });
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ 
        success: false, 
        message: "User already exists with this email" 
      }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with Cloudinary URL (if provided)
    const newUser = await UserModel.create({
      username,
      name,
      email,
      password: hashedPassword,
      accountType,
      image: avatarUrl || "", // Use the Cloudinary URL directly
      provider: "credentials",
    });

    // Return the user without sensitive information
    return NextResponse.json({ 
      success: true, 
      message: "User registered successfully", 
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        accountType: newUser.accountType,
        image: newUser.image
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Registration failed. Please try again." 
    }, { status: 500 });
  }
}

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS(request) {
  return NextResponse.json({}, { status: 200 });
}