"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowRight, Clock, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";

export default function TakeExamPage() {
  const params = useParams();
  const examId = params.id;

  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedQuestions, setMarkedQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isTimeWarningVisible, setIsTimeWarningVisible] = useState(false);
  const [isTabSwitchWarningVisible, setIsTabSwitchWarningVisible] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for API data
  const [exam, setExam] = useState(null);
  const [questionData, setQuestionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch exam details using examId from useParams
        const examResponse = await axios.get(`/api/exam/${examId}`);

        if (!examResponse.data.success) {
          throw new Error("Failed to load exam");
        }

        // Fetch exam questions
        const questionsResponse = await axios.get(
          `/api/exam/question?examId=${examId}`
        );

        if (
          !questionsResponse.data.success ||
          !questionsResponse.data.questions?.length
        ) {
          throw new Error("No questions found for this exam");
        }

        setExam(examResponse.data.exam);
        setQuestionData(questionsResponse.data);
        setTimeLeft(examResponse.data.exam.duration * 60); // Convert minutes to seconds
      } catch (error) {
        console.error("Error fetching exam data:", error);
        setError(error.message || "Failed to load exam data");
      } finally {
        setIsLoading(false);
      }
    };

    if (examId) {
      fetchData();
    }
  }, [examId]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle timer
  useEffect(() => {
    if (!exam || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }

        // Show warning when 5 minutes remaining
        if (prev === 300) {
          setIsTimeWarningVisible(true);
          setTimeout(() => setIsTimeWarningVisible(false), 10000);
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [exam, timeLeft]);

  // Handle tab visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setIsTabSwitchWarningVisible(true);
        setTimeout(() => setIsTabSwitchWarningVisible(false), 5000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Disable right-click
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  // Handle answer selection
  const handleAnswerSelect = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: value,
    }));
  };

  // Navigate to next question
  const handleNextQuestion = () => {
    if (!questionData) return;
    if (currentQuestion < questionData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Navigate to previous question
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Toggle mark question for review
  const handleMarkQuestion = () => {
    if (markedQuestions.includes(currentQuestion)) {
      setMarkedQuestions(markedQuestions.filter((q) => q !== currentQuestion));
    } else {
      setMarkedQuestions([...markedQuestions, currentQuestion]);
    }
  };

  // Navigate to specific question
  const handleQuestionClick = (index) => {
    setCurrentQuestion(index);
  };

  // Submit exam
  // Frontend code for submitting exam
  const handleSubmitExam = async () => {
    try {
      setIsSubmitting(true);

      // Format the answers for submission
      const formattedAnswers = {};
      const questions = questionData.questions;

      // For each question, check if user answered it and format the answer
      questions.forEach((question, index) => {
        // If user answered this question
        if (answers[index] !== undefined) {
          formattedAnswers[index] = {
            questionId: index, // Use question index as identifier
            selectedOption: parseInt(answers[index]), // Convert string to number
            questionText: question.text, // Include question text for reference
          };
        }
      });

      // Submit to backend API
      const response = await axios.post("/api/exam/submit", {
        examId: examId,
        answers: formattedAnswers,
        timeSpent: exam.duration * 60 - timeLeft, // Time spent in seconds
        totalQuestions: questions.length,
      });

      if (response.data.success) {
        // Store results in local storage to be accessed on results page
        sessionStorage.setItem(
          `exam-${examId}-results`,
          JSON.stringify(response.data)
        );

        // Navigate to results page
        router.push(
          `/dashboard/exams/${examId}/results?resultId=${response.data.resultId}`
        );
      } else {
        throw new Error(response.data.message || "Failed to submit exam");
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
      alert("Failed to submit exam. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsSubmitDialogOpen(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <Clock className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg font-medium">Loading exam...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !exam || !questionData) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" /> Error
            </CardTitle>
            <CardDescription>Failed to load exam</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{error || "This exam may not exist or has no questions."}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/dashboard/exams")}>
              Back to Exams
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Calculate progress
  const questions = questionData.questions;
  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(answers).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  return (
    <div className="flex flex-col">
      {/* Header with timer and progress */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background p-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">{exam.title}</h1>
          <div className="hidden md:block">
            <Progress value={progress} className="h-2 w-[200px]" />
            <p className="text-xs text-muted-foreground">
              {answeredQuestions} of {totalQuestions} questions answered
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span
              className={`font-mono ${
                timeLeft < 300 ? "text-red-500 font-bold" : ""
              }`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
          <Button onClick={() => setIsSubmitDialogOpen(true)}>
            Submit Exam
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Question navigation sidebar */}
        <div className="border-b md:w-64 md:border-r md:border-b-0">
          <div className="p-4">
            <h2 className="mb-2 font-medium">Questions</h2>
            <div className="grid grid-cols-5 gap-2 md:grid-cols-3">
              {Array.from({ length: totalQuestions }, (_, index) => (
                <Button
                  key={index}
                  variant={
                    currentQuestion === index
                      ? "default"
                      : answers[index]
                      ? "outline"
                      : "ghost"
                  }
                  size="sm"
                  className={`relative ${
                    markedQuestions.includes(index)
                      ? "ring-2 ring-yellow-500"
                      : ""
                  }`}
                  onClick={() => handleQuestionClick(index)}
                >
                  {index + 1}
                  {markedQuestions.includes(index) && (
                    <Flag className="absolute -right-1 -top-1 h-3 w-3 text-yellow-500" />
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Question and answer area */}
        <div className="flex-1 p-4">
          {isTimeWarningVisible && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Time Warning</AlertTitle>
              <AlertDescription>
                You have 5 minutes remaining. Please finish your exam.
              </AlertDescription>
            </Alert>
          )}

          {isTabSwitchWarningVisible && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                Tab switching detected. This activity is logged and may be
                considered cheating.
              </AlertDescription>
            </Alert>
          )}

          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Question {currentQuestion + 1}</CardTitle>
              <CardDescription>
                {markedQuestions.includes(currentQuestion)
                  ? "Marked for review"
                  : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{questions[currentQuestion].text}</p>
              <RadioGroup
                value={answers[currentQuestion] || ""}
                onValueChange={handleAnswerSelect}
              >
                {questions[currentQuestion].options.map((option, idx) => (
                  <div key={idx} className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem
                      value={idx.toString()}
                      id={`question-${currentQuestion}-option-${idx}`}
                    />
                    <Label
                      htmlFor={`question-${currentQuestion}-option-${idx}`}
                    >
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestion === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNextQuestion}
                  disabled={currentQuestion === totalQuestions - 1}
                >
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <Button
                variant={
                  markedQuestions.includes(currentQuestion)
                    ? "default"
                    : "outline"
                }
                onClick={handleMarkQuestion}
              >
                <Flag className="mr-2 h-4 w-4" />
                {markedQuestions.includes(currentQuestion)
                  ? "Unmark"
                  : "Mark for Review"}
              </Button>
            </CardFooter>
          </Card>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevQuestion}
              disabled={currentQuestion === 0}
              className="md:hidden"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button
              variant="outline"
              onClick={handleNextQuestion}
              disabled={currentQuestion === totalQuestions - 1}
              className="md:hidden"
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Submit confirmation dialog */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Exam</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your exam? You cannot return to
              the exam after submission.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-2 text-sm font-medium">Exam Summary:</p>
            <ul className="space-y-1 text-sm">
              <li>Total Questions: {totalQuestions}</li>
              <li>Answered: {answeredQuestions}</li>
              <li>Unanswered: {totalQuestions - answeredQuestions}</li>
              <li>Marked for Review: {markedQuestions.length}</li>
            </ul>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSubmitDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitExam} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Exam"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
