"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Loader2, 
  Plus, 
  Pencil, 
  Trash2, 
  ArrowLeft 
} from "lucide-react";

export default function ExamQuestionsPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id;
  
  const [exam, setExam] = useState({});  // Initialize as empty object
  const [questions, setQuestions] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  const form = useForm({
    defaultValues: {
      questionText: "",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false }
      ]
    }
  });

  // Fetch exam data and questions
  useEffect(() => {
    const fetchExamAndQuestions = async () => {
      try {
        setLoading(true);
        // Fetch exam details
        const examResponse = await fetch(`/api/exam/${examId}`);
        if (!examResponse.ok) {
          throw new Error("Failed to fetch exam details");
        }
        const examData = await examResponse.json();
        if (!examData.exam) {
          throw new Error("Exam data not found");
        }
        setExam(examData.exam || {});
        
        // Fetch exam questions using the correct API endpoint
        const questionsResponse = await fetch(`/api/exam/question?examId=${examId}`);
        if (!questionsResponse.ok) {
          throw new Error("Failed to fetch questions");
        }
        const questionsData = await questionsResponse.json();
        
        // Transform questions data to match frontend expected format
        const transformedQuestions = questionsData.questions?.map(q => ({
          _id: q._id,
          questionText: q.text, // Map from API's 'text' to frontend's 'questionText'
          options: q.options
        })) || [];
        
        setQuestions(transformedQuestions);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(`Failed to load exam data: ${error.message}`);
        // Ensure state is set with safe defaults on error
        setExam({});
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (examId) {
      fetchExamAndQuestions();
    }
  }, [examId]);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      
      // Validate that at least one option is marked as correct
      const hasCorrectOption = data.options.some(option => option.isCorrect);
      if (!hasCorrectOption) {
        toast.error("At least one option must be marked as correct");
        return;
      }
      
      // Prepare the question data in the format expected by the API
      const questionData = {
        examId,
        text: data.questionText, // Changed from questionText to text to match API
        options: data.options,
      };
      
      // Use the correct API endpoint
      const response = await fetch('/api/exam/question', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Failed to save question");
      }
      
      // Transform the new question to match frontend format and add it to state
      const newQuestion = {
        _id: result.newQuestion?._id || Date.now().toString(),
        questionText: result.newQuestion?.text || data.questionText,
        options: result.newQuestion?.options || data.options
      };
      
      setQuestions([...questions, newQuestion]);
      toast.success("Question added successfully!");
      
      // Reset form
      form.reset({
        questionText: "",
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false }
        ]
      });
      
    } catch (error) {
      console.error("Error saving question:", error);
      toast.error(error.message || "Failed to save question");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditQuestion = (question) => {
    if (!question || !question._id) {
      toast.error("Invalid question data");
      return;
    }
    
    setEditingQuestionId(question._id);
    form.reset({
      questionText: question.questionText || "",
      options: Array.isArray(question.options) ? question.options : [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false }
      ]
    });
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!questionId) {
      toast.error("Invalid question ID");
      return;
    }
    
    if (!confirm("Are you sure you want to delete this question?")) {
      return;
    }
    
    try {
      // Note: The DELETE endpoint isn't implemented in the provided route.js
      // This is a placeholder for when you implement that endpoint
      const response = await fetch(`/api/exam/question?examId=${examId}&questionId=${questionId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to delete question");
      }
      
      // Update local questions state
      setQuestions(questions.filter(q => q._id !== questionId));
      toast.success("Question deleted successfully!");
      
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error(error.message || "Failed to delete question");
    }
  };

  const cancelEditing = () => {
    setEditingQuestionId(null);
    form.reset({
      questionText: "",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false }
      ]
    });
  };

  if (loading) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Questions</h1>
          <p className="text-muted-foreground">
            {exam?.title || "Untitled Exam"} - {questions?.length || 0} of {exam?.totalQuestions || 0} questions added
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingQuestionId ? "Edit Question" : "Add New Question"}</CardTitle>
          <CardDescription>
            {editingQuestionId 
              ? "Update the question details below" 
              : "Enter the question details below"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="questionText"
                rules={{ required: "Question text is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Text</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter your question here..." 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormLabel>Answer Options</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Add options and check the correct answer(s)
                </p>

                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Checkbox
                      id={`option-${index}-correct`}
                      checked={form.watch(`options.${index}.isCorrect`)}
                      onCheckedChange={(checked) => {
                        form.setValue(`options.${index}.isCorrect`, checked);
                      }}
                    />
                    <div className="flex-1 space-y-1">
                      <FormField
                        control={form.control}
                        name={`options.${index}.text`}
                        rules={{ required: "Option text is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                placeholder={`Option ${index + 1}`} 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2">
                {editingQuestionId && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={cancelEditing}
                  >
                    Cancel Editing
                  </Button>
                )}
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingQuestionId ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>
                      {editingQuestionId ? (
                        "Update Question"
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Question
                        </>
                      )}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Questions List</CardTitle>
          <CardDescription>
            {!Array.isArray(questions) || questions.length === 0 
              ? "No questions added yet" 
              : `${questions.length} question(s) added to this exam`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!Array.isArray(questions) || questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground">
                No questions have been added to this exam yet.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Use the form above to add questions.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Options</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((question, idx) => (
                    <TableRow key={question?._id || idx}>
                      <TableCell className="font-medium">
                        {question?.questionText || "No question text"}
                      </TableCell>
                      <TableCell>
                        <ul className="list-disc pl-5 space-y-1">
                          {Array.isArray(question?.options) ? question.options.map((option, index) => (
                            <li key={index} className={option?.isCorrect ? "font-medium text-green-600" : ""}>
                              {option?.text || "No option text"}
                              {option?.isCorrect && " (Correct)"}
                            </li>
                          )) : (
                            <li>No options available</li>
                          )}
                        </ul>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleEditQuestion(question)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteQuestion(question?._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {questions?.length || 0} of {exam?.totalQuestions || 0} questions added
          </div>
          <Button
            onClick={() => router.push("/admin/list")}
            variant="outline"
            disabled={!exam?.totalQuestions || (questions?.length || 0) < (exam?.totalQuestions || 0)}
          >
            {!exam?.totalQuestions || (questions?.length || 0) < (exam?.totalQuestions || 0)
              ? `${(exam?.totalQuestions || 0) - (questions?.length || 0)} more questions needed`
              : "Done - View All Exams"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}