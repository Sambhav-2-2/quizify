"use client";
import React from "react";
import { BackgroundBeams } from "./ui/background-beams";
import { motion } from "framer-motion";

export function BackgroundBeamsDemo() {
  // Animation variants for the cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.3,
        duration: 0.5
      }
    })
  };

  // Animation variants for the connecting beams
  const beamVariants = {
    hidden: { scaleX: 0 },
    visible: (i) => ({
      scaleX: 1,
      transition: {
        delay: i * 0.3 + 0.2, 
        duration: 0.5,
        ease: "easeInOut"
      }
    })
  };

  return (
    <div className="h-fit w-full rounded-md bg-background text-foreground dark:bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 relative z-10">
        <div className="px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-foreground dark:text-white">
                How It Works
              </h2>
              <p className="max-w-[900px] text-muted-foreground dark:text-neutral-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform simplifies the entire exam process from
                creation to certification
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-3 mt-12 relative gap-2">            
            {[
              {
                step: "1",
                title: "Create Exams",
                description:
                  "Admins create exams with various question types and set parameters",
              },
              {
                step: "2",
                title: "Take Exams",
                description:
                  "Students take secure, timed exams with anti-cheating measures",
              },
              {
                step: "3",
                title: "Get Certified",
                description:
                  "Receive instant results, analytics, and downloadable certificates",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center px-4 py-6 z-10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 1 }}
                custom={index}
                variants={cardVariants}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground dark:bg-white dark:text-black">
                  {step.step}
                </div>
                <h3 className="mt-4 text-xl font-bold text-foreground dark:text-white">{step.title}</h3>
                <p className="mt-2 text-muted-foreground dark:text-neutral-300">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <BackgroundBeams />
    </div>
  );
}