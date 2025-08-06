"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner"; // Updated import for Sonner
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const categories = [
  "Programming",
  "Mathematics",
  "Science",
  "History",
  "Literature",
  "Geography",
  "Art",
  "Music",
  "Sports",
  "General Knowledge",
  "Technology"
];

export default function CreateExamPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      dateTime: "",
      duration: 60,
      totalQuestions: 10,
      category: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Format the form data for the API
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("dateTime", data.dateTime);
      formData.append("duration", data.duration);
      formData.append("totalQuestions", data.totalQuestions);
      formData.append("category", data.category);
      
      // Call the API endpoint
      const response = await fetch("/api/exam/create", {
        method: "POST",
        body: formData,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Failed to create exam");
      }
      
      // Show success message with Sonner
      toast.success("Exam created successfully!");
      
      // Redirect to the exam questions page
      router.push(`/admin/exams/${result.exam._id}/questions`);
      
    } catch (error) {
      console.error("Error creating exam:", error);
      
      // Show error message with Sonner
      toast.error(error.message || "Failed to create exam");
      
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate min date (today) for the date picker
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Exam</h1>
        <p className="text-muted-foreground">
          Fill in the details below to create a new exam.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exam Information</CardTitle>
          <CardDescription>
            Enter the basic details for the exam.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  rules={{
                    required: "Title is required",
                    maxLength: {
                      value: 100,
                      message: "Title cannot exceed 100 characters",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exam Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. JavaScript Fundamentals" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  rules={{
                    required: "Category is required",
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                rules={{
                  required: "Description is required",
                  maxLength: {
                    value: 500,
                    message: "Description cannot exceed 500 characters",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a brief description of this exam..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="dateTime"
                  rules={{
                    required: "Date and time is required",
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exam Date & Time</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          min={minDate}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  rules={{
                    required: "Duration is required",
                    min: {
                      value: 5,
                      message: "Duration must be at least 5 minutes",
                    },
                    max: {
                      value: 180,
                      message: "Duration cannot exceed 180 minutes",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalQuestions"
                  rules={{
                    required: "Number of questions is required",
                    min: {
                      value: 1,
                      message: "At least 1 question is required",
                    },
                    max: {
                      value: 100,
                      message: "Cannot exceed 100 questions",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Questions</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <CardFooter className="flex justify-between px-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Exam"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}