"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Loader2 } from "lucide-react";

const AiPracticeQuiz = () => {
  const router = useRouter();

  // Form state
  const [quizForm, setQuizForm] = useState({
    topic: "",
    difficulty: "beginner",
    numQuestions: 10,
    questionTypes: {
      multipleChoice: true,
      trueFalse: false,
      shortAnswer: false,
      fillBlanks: false,
    },
    instructions: "",
  });
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setQuizForm({ 
      ...quizForm, 
      [id === "questions" ? "numQuestions" : id]: id === "questions" ? parseInt(value) : value 
    });
  };

  // Handle checkbox changes - FIXED VERSION
  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    
    // Map checkbox IDs to state property names
    const idToProperty = {
      'multiple-choice': 'multipleChoice',
      'true-false': 'trueFalse',
      'short-answer': 'shortAnswer',
      'fill-blanks': 'fillBlanks'
    };
    
    const propertyName = idToProperty[id];
    
    if (propertyName) {
      setQuizForm({
        ...quizForm,
        questionTypes: {
          ...quizForm.questionTypes,
          [propertyName]: checked,
        },
      });
    }
  };

  // Handle form submission - now with direct navigation
  const handleGenerateQuiz = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizForm),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }
      
      const generatedQuiz = await response.json();
      
      // Generate a unique ID for the quiz
      const quizId = Date.now().toString();
      
      // Save quiz data to localStorage
      localStorage.setItem(`quiz_${quizId}`, JSON.stringify({
        ...generatedQuiz,
        difficulty: quizForm.difficulty,
      }));
      
      // Immediately redirect to the quiz page
      router.push(`/dashboard/ai-test/quiz/${quizId}`);
      
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-white dark:bg-background py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-5xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.h1
          className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center mb-6"
          variants={itemVariants}
        >
          Test yourself with AI-powered practice tests
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-center max-w-2xl mx-auto mb-8 text-slate-700 dark:text-slate-300"
          variants={itemVariants}
        >
          Create engaging quizzes that are fully customizable and designed to
          enhance your learning experience. Generate your quiz in seconds and
          easily integrate it with other platforms.
        </motion.p>

        <motion.div
          className="grid md:grid-cols-3 gap-6 mb-10"
          variants={itemVariants}
        >
          {[
            {
              title: "Custom Content",
              description: "Tailor quizzes to your specific learning needs",
            },
            {
              title: "Instant Generation",
              description: "Get your personalized quiz in seconds",
            },
            {
              title: "Performance Tracking",
              description:
                "Monitor your progress and identify areas to improve",
            },
          ].map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>{feature.description}</CardContent>
            </Card>
          ))}
        </motion.div>

        <motion.div className="flex justify-center" variants={itemVariants}>
          <Drawer>
            <DrawerTrigger asChild>
              <Button className="h-18 text-xl">Create your quiz now</Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-lg p-4">
                <DrawerHeader>
                  <DrawerTitle className="text-2xl font-bold text-center">
                    Create Your Practice Quiz
                  </DrawerTitle>
                  <DrawerDescription className="text-center">
                    Customize your AI-powered quiz to meet your specific
                    learning needs
                  </DrawerDescription>
                </DrawerHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="topic" className="text-sm font-medium">
                      Quiz Topic
                    </label>
                    <input
                      id="topic"
                      placeholder="e.g., JavaScript Fundamentals, World History"
                      className="w-full rounded-md border border-gray-300 p-2 dark:bg-white-800 dark:border-gray-700"
                      value={quizForm.topic}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="difficulty" className="text-sm font-medium">
                      Difficulty Level
                    </label>
                    <select
                      id="difficulty"
                      className="w-full rounded-md border border-gray-300 p-2 dark:bg-black-800 dark:border-gray-700"
                      value={quizForm.difficulty}
                      onChange={handleInputChange}
                    >
                      <option className="bg-white dark:bg-black" value="beginner">Beginner</option>
                      <option className="bg-white dark:bg-black" value="intermediate">Intermediate</option>
                      <option className="bg-white dark:bg-black" value="advanced">Advanced</option>
                      <option className="bg-white dark:bg-black" value="expert">Expert</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="questions" className="text-sm font-medium">
                      Number of Questions
                    </label>
                    <input
                      id="questions"
                      type="number"
                      min="5"
                      max="50"
                      value={quizForm.numQuestions}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 p-2 dark:bg-black-800 dark:border-gray-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Question Types
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="multiple-choice"
                          checked={quizForm.questionTypes.multipleChoice}
                          onChange={handleCheckboxChange}
                        />
                        <label htmlFor="multiple-choice">Multiple Choice</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="true-false"
                          checked={quizForm.questionTypes.trueFalse}
                          onChange={handleCheckboxChange}
                        />
                        <label htmlFor="true-false">True/False</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="short-answer"
                          checked={quizForm.questionTypes.shortAnswer}
                          onChange={handleCheckboxChange}
                        />
                        <label htmlFor="short-answer">Short Answer</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="fill-blanks"
                          checked={quizForm.questionTypes.fillBlanks}
                          onChange={handleCheckboxChange}
                        />
                        <label htmlFor="fill-blanks">Fill in the Blanks</label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="instructions"
                      className="text-sm font-medium"
                    >
                      Additional Instructions
                    </label>
                    <textarea
                      id="instructions"
                      placeholder="Any specific topics to focus on or other instructions..."
                      rows="3"
                      value={quizForm.instructions}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 p-2 dark:bg-black-800 dark:border-gray-700"
                    />
                  </div>
                </div>

                <DrawerFooter>
                  <Button 
                    className="w-full" 
                    onClick={handleGenerateQuiz}
                    disabled={isLoading || !quizForm.topic}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Quiz & Redirecting...
                      </>
                    ) : (
                      'Generate Quiz'
                    )}
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AiPracticeQuiz;