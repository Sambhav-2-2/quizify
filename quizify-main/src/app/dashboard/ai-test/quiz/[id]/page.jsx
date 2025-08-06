"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

const QuizPage = ({ params }) => {
  const router = useRouter();
  const param = useParams();
  const { id } = param;
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentAnswers, setCurrentAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  
  // Fetch the quiz data when the component mounts
  useEffect(() => {
    const quizData = localStorage.getItem(`quiz_${id}`);
    if (quizData) {
      const parsedQuiz = JSON.parse(quizData);
      setQuiz(parsedQuiz);
      
      // Initialize answers object
      const initialAnswers = {};
      parsedQuiz.questions.forEach((question, index) => {
        initialAnswers[index] = null;
      });
      setCurrentAnswers(initialAnswers);
      setLoading(false);
    } else {
      // If quiz not found, redirect to quiz creation page
      router.push("/dashboard/ai-test");
    }
  }, [id, router]);
  
  // Handle answer changes
  const handleAnswerChange = (questionIndex, answer) => {
    setCurrentAnswers({
      ...currentAnswers,
      [questionIndex]: answer,
    });
  };
  
  // Submit quiz and calculate score
  const handleSubmit = () => {
    let correctCount = 0;
    
    quiz.questions.forEach((question, index) => {
      const userAnswer = currentAnswers[index];
      
      // Different comparison based on question type
      if (question.type === "multiple-choice" || question.type === "true-false") {
        if (userAnswer === question.correctAnswer) {
          correctCount++;
        }
      } else if (question.type === "short-answer") {
        // For short answer, we could do a more flexible comparison
        // This is a simple implementation - could be enhanced with AI
        if (userAnswer && question.correctAnswer && 
            userAnswer.toLowerCase().includes(question.correctAnswer.toLowerCase())) {
          correctCount++;
        }
      } else if (question.type === "fill-in-the-blanks") {
        // Simple exact match for fill-in-the-blanks
        if (userAnswer === question.correctAnswer) {
          correctCount++;
        }
      }
    });
    
    const finalScore = Math.round((correctCount / quiz.questions.length) * 100);
    setScore(finalScore);
    setSubmitted(true);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading quiz...</span>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{quiz.title}</CardTitle>
            <p className="text-muted-foreground">
              {quiz.questions.length} questions • {quiz.difficulty} difficulty
            </p>
          </CardHeader>
        </Card>
        
        {!submitted ? (
          // Quiz taking UI
          <>
            {quiz.questions.map((question, questionIndex) => (
              <Card key={questionIndex} className="mb-6">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {questionIndex + 1}. {question.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {question.type === "multiple-choice" && (
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center">
                          <input
                            type="radio"
                            id={`q${questionIndex}-opt${optionIndex}`}
                            name={`question-${questionIndex}`}
                            className="mr-2"
                            checked={currentAnswers[questionIndex] === option}
                            onChange={() => handleAnswerChange(questionIndex, option)}
                          />
                          <label htmlFor={`q${questionIndex}-opt${optionIndex}`}>{option}</label>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {question.type === "true-false" && (
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id={`q${questionIndex}-true`} 
                          name={`question-${questionIndex}`} 
                          className="mr-2"
                          checked={currentAnswers[questionIndex] === "True"}
                          onChange={() => handleAnswerChange(questionIndex, "True")}
                        />
                        <label htmlFor={`q${questionIndex}-true`}>True</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id={`q${questionIndex}-false`} 
                          name={`question-${questionIndex}`} 
                          className="mr-2"
                          checked={currentAnswers[questionIndex] === "False"}
                          onChange={() => handleAnswerChange(questionIndex, "False")}
                        />
                        <label htmlFor={`q${questionIndex}-false`}>False</label>
                      </div>
                    </div>
                  )}
                  
                  {question.type === "short-answer" && (
                    <textarea
                      id={`q${questionIndex}-answer`}
                      rows="3"
                      className="w-full rounded-md border border-gray-300 p-2"
                      placeholder="Type your answer here..."
                      value={currentAnswers[questionIndex] || ""}
                      onChange={(e) => handleAnswerChange(questionIndex, e.target.value)}
                    />
                  )}
                  
                  {question.type === "fill-in-the-blanks" && (
                    <input
                      type="text"
                      id={`q${questionIndex}-blank`}
                      className="border-b-2 border-gray-300 focus:border-primary p-2 w-full"
                      placeholder="Enter your answer..."
                      value={currentAnswers[questionIndex] || ""}
                      onChange={(e) => handleAnswerChange(questionIndex, e.target.value)}
                    />
                  )}
                </CardContent>
              </Card>
            ))}
            
            <div className="flex justify-end mt-6">
              <Button onClick={handleSubmit} size="lg">
                Submit Answers
              </Button>
            </div>
          </>
        ) : (
          // Results UI
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Your Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">{score}%</div>
                  <Progress value={score} className="h-2 w-full" />
                </div>
                
                <div className="mt-4 text-center">
                  {score >= 80 ? (
                    <p className="text-green-600 dark:text-green-400 font-medium">Excellent work! You've mastered this topic.</p>
                  ) : score >= 60 ? (
                    <p className="text-yellow-600 dark:text-yellow-400 font-medium">Good job! You're on the right track.</p>
                  ) : (
                    <p className="text-red-600 dark:text-red-400 font-medium">Keep practicing! You'll improve with more study.</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Review Your Answers</h2>
              
              {quiz.questions.map((question, questionIndex) => {
                const userAnswer = currentAnswers[questionIndex];
                const isCorrect = 
                  (question.type === "multiple-choice" || question.type === "true-false") 
                    ? userAnswer === question.correctAnswer
                    : (question.type === "short-answer" && userAnswer && question.correctAnswer)
                      ? userAnswer.toLowerCase().includes(question.correctAnswer.toLowerCase())
                      : userAnswer === question.correctAnswer;
                
                return (
                  <Card key={questionIndex} className={isCorrect ? "border-green-500" : "border-red-500"}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className={`inline-block w-6 h-6 rounded-full text-white text-center ${isCorrect ? "bg-green-500" : "bg-red-500"}`}>
                          {isCorrect ? "✓" : "✗"}
                        </span>
                        {questionIndex + 1}. {question.question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="font-medium">Your answer:</p>
                        <p className={isCorrect ? "text-green-600" : "text-red-600"}>
                          {userAnswer || "No answer provided"}
                        </p>
                      </div>
                      
                      {!isCorrect && (
                        <div>
                          <p className="font-medium">Correct answer:</p>
                          <p className="text-green-600">{question.correctAnswer}</p>
                        </div>
                      )}
                      
                      {question.explanation && (
                        <div>
                          <p className="font-medium">Explanation:</p>
                          <p>{question.explanation}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => router.push("/dashboard/ai-test")}>
                Create New Quiz
              </Button>
              <Button onClick={() => {
                setSubmitted(false);
                window.scrollTo(0, 0);
              }}>
                Retake Quiz
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;