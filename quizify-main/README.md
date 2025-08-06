![image](https://github.com/user-attachments/assets/075ba3ae-545c-4698-9737-48db71b31987)

A comprehensive platform for creating, administering, and analyzing interactive exams and quizzes.

## 📝 About

Quizify is a modern platform designed to streamline the creation, administration, and evaluation of exams and quizzes. It offers intuitive tools for educators, trainers, and organizations to create engaging assessments, track participant progress, and analyze results in real-time.

## ✨ Features

- **🔒 Secure Exam Environment** - Anti-cheating measures including tab-switching detection
- **⏱️ Timed Assessments** - Set time limits with automatic submission when time expires
- **🔀 Randomized Questions** - Prevent cheating with randomized question order
- **📊 Performance Analytics** - Detailed insights and reports on quiz performance
- **📜 Certificate Generation** - Automatic PDF certificate generation upon passing
- **🧮 Auto-Grading** - Instant evaluation of responses
- **🤖 AI-Powered Quizzes** - Generate quiz questions automatically using AI

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TailwindCSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS, Aceternity UI
- **AI Integration**: Gemini API for quiz generation

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB database
- GitHub OAuth credentials (for authentication)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Namann-14/quizify.git
   cd quizify
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Create a .env.local file in the root directory with the following variables:
   ```bash
   NEXTAUTH_URL="http://localhost:3000"
   AUTH_SECRET="your-secret-key"
   GITHUB_ID="your-github-oauth-id"
   GITHUB_SECRET="your-github-oauth-secret"
   MONGODB_URI="your-mongodb-connection-string"
   GEMINI_API_KEY="your-gemini-api-key"
   ```
4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
5. Open http://localhost:3000 in your browser

## ⚠️ Important Authentication Note

GitHub Authentication only works properly on localhost.

When deploying to Vercel or other hosting platforms, you'll need to:

- Update the GitHub OAuth callback URL in your GitHub Developer settings
- Set the appropriate NEXTAUTH_URL in your environment variables
- For local testing, make sure your GitHub OAuth app has the callback URL set to:
  http://localhost:3000/api/auth/callback/github

## 💻 Usage

### Admin Dashboard
- Create and manage exams
- Generate AI-powered quiz questions
- Review student performances
- Generate reports

### Student Experience
- Sign in to your account
- Browse available exams
- Take timed assessments
- Get instant feedback and certificates

## 🤖 AI Quiz Generation

Quizify includes a powerful AI quiz generation feature powered by Gemini API that allows educators to:
- Create quizzes from any topic or subject area
- Specify difficulty levels and question types
- Generate complete quiz sets with correct answers and distractors
- Edit and customize AI-generated questions before publishing

## ✅ Status

All features are fully implemented and working. The platform is ready for production use.

## 🌐 Deployment

This app can be easily deployed on Vercel:

<img alt="Deploy with Vercel" src="https://vercel.com/button">

Remember to configure the required environment variables on your deployment platform.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ by Naman  
[LinkedIn](https://www.linkedin.com/in/naman-nayak14/)