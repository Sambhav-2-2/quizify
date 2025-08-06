"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock, FileText, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { useParams } from "next/navigation";

export default function ExamDetailsPage({ params }) {
  // Access the ID directly from params instead of using the 'use' hook
  const examId = useParams().id;

  const [exam, setExam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        setIsLoading(true);
        // Make an API call to fetch exam details by ID
        const response = await axios.get(`/api/exam/${examId}`);

        if (response.data.success) {
          setExam(response.data.exam);
        } else {
          setError("Failed to load exam details. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching exam details:", error);
        setError("Failed to load exam details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (examId) {
      fetchExamDetails();
    } else {
      setIsLoading(false);
      setError("Invalid exam ID");
    }
  }, [examId]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading exam details...</p>
      </div>
    );
  }

  // Render error state
  if (error || !exam) {
    return (
      <Card className="min-h-[400px] flex flex-col items-center justify-center">
        <CardContent className="pt-6 text-center">
          <h2 className="text-xl font-bold text-destructive mb-2">Error</h2>
          <p className="text-muted-foreground mb-4">
            {error || "Exam not found"}
          </p>
          <Button variant="outline" asChild>
            <Link href="/dashboard/exams">Back to Exams</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{exam.title}</h1>
          <p className="text-muted-foreground">Exam ID: {exam._id}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Exam Details</CardTitle>
            <CardDescription>{exam.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-grow">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Date & Time
                </p>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                  <p>
                    {new Date(exam.dateTime).toLocaleDateString()} at{" "}
                    {new Date(exam.dateTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Duration
                </p>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                  <p>{exam.duration} minutes</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Questions
                </p>
                <div className="flex items-center">
                  <FileText className="mr-1 h-4 w-4 text-muted-foreground" />
                  <p>{exam.totalQuestions} questions</p>
                </div>
              </div>
              {exam.passingScore && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Passing Score
                  </p>
                  <div className="flex items-center">
                    <Info className="mr-1 h-4 w-4 text-muted-foreground" />
                    <p>{exam.passingScore}%</p>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="font-medium">Description</p>
              <p className="text-sm text-muted-foreground">
                {exam.description}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              {!exam.topics && !exam.instructions && (
                <div className="mt-4">
                  <h3 className="font-semibold">Instructions:</h3>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground">
                    <li>Do not switch tabs during the exam.</li>
                    <li>Ensure your internet connection is stable.</li>
                    <li>Cheating may result in disqualification.</li>
                    <li>Submit answers before the timer ends.</li>
                    <li>Read each question carefully before answering.</li>
                  </ul>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href={`/dashboard/exams/${exam._id}/take`}>
                  Start Exam
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
