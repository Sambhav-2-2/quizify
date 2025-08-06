"use client";
import React from "react";
import { motion } from "framer-motion";
import { Cover } from "@/components/ui/cover";
import { Button } from "./ui/button";
import Link from "next/link";
import { FloatingQuizElements } from "./floating-quiz-elements";
import { TracingBeamDemo } from "./tracing";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function HeroSection() {
  return (
    <div className="relative w-full overflow-hidden min-h-[80vh]">
      <FloatingQuizElements />
      
      <motion.div
        className="flex flex-col items-center justify-center py-16 text-neutral-900 dark:text-neutral-100 relative z-20 w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl md:text-5xl lg:text-7xl font-bold max-w-7xl mx-auto text-center relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white"
          variants={itemVariants}
        >
          Secure Online Exams <br />
          <Cover>&amp; Instant</Cover> Certification
        </motion.h1>

        <motion.blockquote
          className="max-w-5xl mx-auto text-center border-l-4 border-neutral-300 dark:border-neutral-700 pl-4 py-2 mt-6 italic text-lg text-muted-foreground"
          variants={itemVariants}
        >
          Our platform enables educational institutions and professional
          organizations to conduct secure, automated exams with real-time
          analytics and instant certification.
        </motion.blockquote>

        <motion.div variants={itemVariants}>
          <Link href="/signup">
            <Button className="mt-8 h-18 w-60 text-2xl relative overflow-hidden group">
              <span className="relative z-10">Get Started</span>
            </Button>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="max-w-5xl mx-auto mt-12">
          <TracingBeamDemo />
        </motion.div>
      </motion.div>
    </div>
  );
}