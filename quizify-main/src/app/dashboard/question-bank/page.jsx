"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit, MoreHorizontal, Plus, Search, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function QuestionBankPage() {
  const [activeTab, setActiveTab] = useState("all");

  // Mock question data
  const questions = [
    {
      id: 1,
      text: "What is the derivative of f(x) = x²?",
      type: "multiple-choice",
      difficulty: "easy",
      category: "Calculus",
      lastUpdated: "2025-02-15",
    },
    {
      id: 2,
      text: "Solve the equation: 2x + 5 = 15",
      type: "multiple-choice",
      difficulty: "easy",
      category: "Algebra",
      lastUpdated: "2025-02-20",
    },
    {
      id: 3,
      text: "What is the capital of France?",
      type: "multiple-choice",
      difficulty: "easy",
      category: "Geography",
      lastUpdated: "2025-02-25",
    },
    {
      id: 4,
      text: "Explain the concept of object-oriented programming.",
      type: "essay",
      difficulty: "medium",
      category: "Programming",
      lastUpdated: "2025-03-01",
    },
    {
      id: 5,
      text: "Describe the process of photosynthesis.",
      type: "essay",
      difficulty: "medium",
      category: "Biology",
      lastUpdated: "2025-03-05",
    },
    {
      id: 6,
      text: "Solve the following integral: ∫x²dx",
      type: "multiple-choice",
      difficulty: "medium",
      category: "Calculus",
      lastUpdated: "2025-03-10",
    },
    {
      id: 7,
      text: "What is the time complexity of quicksort in the worst case?",
      type: "multiple-choice",
      difficulty: "hard",
      category: "Algorithms",
      lastUpdated: "2025-03-12",
    },
    {
      id: 8,
      text: "Is the sky blue?",
      type: "true-false",
      difficulty: "easy",
      category: "General Knowledge",
      lastUpdated: "2025-03-15",
    },
  ];

  // Filter questions based on active tab
  const filteredQuestions = questions.filter((question) => {
    if (activeTab === "all") return true;
    if (activeTab === "multiple-choice") return question.type === "multiple-choice";
    if (activeTab === "essay") return question.type === "essay";
    if (activeTab === "true-false") return question.type === "true-false";
    return true;
  });

  // Get difficulty badge color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Question Bank</h1>
          <p className="text-muted-foreground">Manage and organize your exam questions</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/question-bank/create">
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Questions</CardTitle>
          <CardDescription>Browse and manage your question bank</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="multiple-choice">Multiple Choice</TabsTrigger>
                  <TabsTrigger value="essay">Essay</TabsTrigger>
                  <TabsTrigger value="true-false">True/False</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search questions..."
                    className="w-full rounded-md pl-8 md:w-[200px] lg:w-[300px]"
                  />
                </div>

                <Select defaultValue="all">
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="calculus">Calculus</SelectItem>
                    <SelectItem value="algebra">Algebra</SelectItem>
                    <SelectItem value="programming">Programming</SelectItem>
                    <SelectItem value="biology">Biology</SelectItem>
                    <SelectItem value="geography">Geography</SelectItem>
                    <SelectItem value="general-knowledge">General Knowledge</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="all">
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="hidden md:table-cell">Difficulty</TableHead>
                    <TableHead className="hidden md:table-cell">Last Updated</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuestions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell className="font-medium">{question.text}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">
                          {question.type === "multiple-choice" ? "Multiple Choice" : question.type === "essay" ? "Essay" : "True/False"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{question.category}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getDifficultyColor(question.difficulty)}`}
                        >
                          {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(question.lastUpdated).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/question-bank/${question.id}`}>View</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/question-bank/${question.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}