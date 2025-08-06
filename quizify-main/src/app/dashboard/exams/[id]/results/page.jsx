"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
export default function ExamResultsPage({ params }) {
  const [activeTab, setActiveTab] = useState("summary");
  const [examResult, setExamResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const param = useParams();
  const paramsID = param.id;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        // Fetch data using the examId from paramsID
        const response = await fetch(`/api/exam/result?examId=${paramsID}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch result");
        }
        
        const data = await response.json();
        setExamResult(data.result);
      } catch (err) {
        console.error("Error fetching results:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [paramsID]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <h2 className="text-2xl font-bold text-red-600">Error Loading Results</h2>
        <p>{error}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  if (!examResult) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <h2 className="text-2xl font-bold">No Results Found</h2>
        <p>We couldn't find any results for this exam.</p>
        <Button asChild>
          <Link href="/dashboard/exams">Back to Exams</Link>
        </Button>
      </div>
    );
  }

  // Data for pie chart
  const pieData = [
    { name: "Correct", value: examResult.correctAnswers },
    { name: "Incorrect", value: examResult.incorrectAnswers },
    { name: "Skipped", value: examResult.skippedQuestions },
  ];

  const COLORS = ["#10b981", "#ef4444", "#f59e0b"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exam Results</h1>
          <p className="text-muted-foreground">
            {examResult.title} - {new Date(examResult.date).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/exams">Back to Exams</Link>
          </Button>
          {examResult.passed && (
            <Button asChild>
              <Link href={`/dashboard/certificates/${examResult.id}`}>
                <Download className="mr-2 h-4 w-4" />
                Certificate
              </Link>
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Result Summary</CardTitle>
          <CardDescription>
            {examResult.passed ? "Congratulations! You passed the exam." : "Unfortunately, you did not pass the exam."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Score: {examResult.score}%</span>
              <span className="text-sm font-medium">Passing Score: {examResult.passingScore}%</span>
            </div>
            <Progress value={examResult.score} className="h-2" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Total Questions</p>
              <p className="text-2xl font-bold">{examResult.totalQuestions}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Correct Answers</p>
              <p className="text-2xl font-bold text-green-600">{examResult.correctAnswers}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Incorrect Answers</p>
              <p className="text-2xl font-bold text-red-600">{examResult.incorrectAnswers}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Time Taken</p>
              <p className="text-2xl font-bold">{examResult.timeTaken}</p>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Final Result</p>
                <p className="text-sm text-muted-foreground">Based on the passing criteria</p>
              </div>
              <div
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  examResult.passed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {examResult.status}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="summary" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="summary">Performance Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
                <CardDescription>Breakdown of your answers</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
                <CardDescription>Percentage breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">Correct</span>
                    <span className="text-sm font-medium">{examResult.scoreDistribution.correctPercentage}%</span>
                  </div>
                  <Progress value={examResult.scoreDistribution.correctPercentage} className="h-2 bg-slate-200">
                    <div className="h-full bg-green-600" style={{width: `${examResult.scoreDistribution.correctPercentage}%`}} />
                  </Progress>
                </div>
                
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">Incorrect</span>
                    <span className="text-sm font-medium">{examResult.scoreDistribution.incorrectPercentage}%</span>
                  </div>
                  <Progress value={examResult.scoreDistribution.incorrectPercentage} className="h-2 bg-slate-200">
                    <div className="h-full bg-red-600" style={{width: `${examResult.scoreDistribution.incorrectPercentage}%`}} />
                  </Progress>
                </div>
                
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">Skipped</span>
                    <span className="text-sm font-medium">{examResult.scoreDistribution.skippedPercentage}%</span>
                  </div>
                  <Progress value={examResult.scoreDistribution.skippedPercentage} className="h-2 bg-slate-200">
                    <div className="h-full bg-amber-500" style={{width: `${examResult.scoreDistribution.skippedPercentage}%`}} />
                  </Progress>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}