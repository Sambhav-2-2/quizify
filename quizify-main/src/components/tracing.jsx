"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { TracingBeam } from "./ui/tracing-beam";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

export function TracingBeamDemo() {
  return (
    <>
      <TracingBeam className="px-6 py-12">
        <div className="max-w-6xl mx-auto antialiased pt-8 relative">
          <h1 className="text-5xl font-bold mb-10 text-center text-gray-850 dark:text-white">
            Our Learning Journey
          </h1>
          {dummyContent.map((item, index) => (
            <motion.div
              key={`content-${index}`}
              className={`mb-16 flex flex-col ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } gap-8 items-center`}
              initial={{ 
                opacity: 0, 
                x: index % 2 === 0 ? -100 : 100 
              }}
              whileInView={{ 
                opacity: 1, 
                x: 0 
              }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.2,
                ease: "easeOut" 
              }}
            >
              {item?.image && (
                <div className="w-full md:w-1/2">
                  <Image
                    src={item.image}
                    alt={item.title}
                    height="600"
                    width="800"
                    className="rounded-xl shadow-lg object-cover w-full h-[300px]"
                  />
                </div>
              )}

              <div className="w-full md:w-1/2 space-y-4 bg-white dark:bg-background p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="bg-black dark:bg-foreground dark:text-black text-white rounded-full text-sm px-4 py-1">
                    {item.badge}
                  </span>
                  <div className="h-[1px] flex-grow bg-gray-200 dark:bg-gray-600"></div>
                </div>

                <h2 className={twMerge("text-2xl font-bold text-gray-900 dark:text-white")}>{item.title}</h2>

                <div className="text-base prose prose-gray dark:prose-invert">
                  {item.description}
                </div>

                <Button>Learn More</Button>
              </div>
            </motion.div>
          ))}
        </div>
      </TracingBeam>
    </>
  );
}

const dummyContent = [
  {
    title: "Interactive Quizzes for Effective Learning",
    description: (
      <>
        <p>
          Quizify offers engaging, interactive quizzes designed to reinforce your knowledge through active recall. 
          Our adaptive quiz engine tailors questions to your skill level, helping you focus on areas that need improvement while building confidence in topics you already understand.
        </p>
      </>
    ),
    badge: "Quizzes",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
  },
  {
    title: "Track Your Progress and Growth",
    description: (
      <>
        <p>
          Monitor your learning journey with comprehensive analytics and progress tracking. See your improvement over time, 
          identify knowledge gaps, and celebrate milestones as you advance through increasingly challenging content tailored to your goals.
        </p>
      </>
    ),
    badge: "Progress",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
  },
  {
    title: "Multiple Quiz Formats for Any Subject",
    description: (
      <>
        <p>
          Choose from various quiz types including multiple choice, flashcards, fill-in-the-blank, and timed challenges. 
          Our platform supports learning across diverse subjects, from academic topics to professional certifications and personal interests.
        </p>
      </>
    ),
    badge: "Formats",
    image:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
  },
];