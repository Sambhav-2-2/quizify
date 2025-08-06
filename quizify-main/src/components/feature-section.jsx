'use client';
import React from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  IconClock,
  IconArrowsShuffle,
  IconCheckbox,
  IconChartBar,
  IconCertificate,
  IconShieldLock,
} from "@tabler/icons-react";

export function FeatureSection() {
  // Animation variants for container with staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  };

  // Animation variants for individual cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration: 0.5
      }
    }
  };

  const features = [
    {
      title: "Timed Exams",
      description: "Set time limits for exams with auto-submission when time expires",
      icon: <IconClock size={24} />,
    },
    {
      title: "Randomized Questions",
      description: "Prevent cheating with randomized question order for each attempt",
      icon: <IconArrowsShuffle size={24} />,
    },
    {
      title: "Auto-Grading",
      description: "Instant evaluation of MCQs and objective questions",
      icon: <IconCheckbox size={24} />,
    },
    {
      title: "Performance Analytics",
      description: "Detailed insights and reports on exam performance",
      icon: <IconChartBar size={24} />,
    },
    {
      title: "Certificate Generation",
      description: "Automatic PDF certificate generation upon passing exams",
      icon: <IconCertificate size={24} />,
    },
    {
      title: "Secure Environment",
      description: "Anti-cheating measures including tab-switching detection",
      icon: <IconShieldLock size={24} />,
    },
  ];

  return (
    <BackgroundBeamsWithCollision>
      <section id="features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2
              className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
              Platform{" "}
              <div
                className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                <div
                  className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                  <span className="">Features</span>
                </div>
                <div
                  className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
                  <span className="">Features</span>
                </div>
              </div>
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed relative z-20">
              Everything you need to conduct secure online exams and
              provide instant certification
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative z-10 max-w-7xl mx-auto mt-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
              >
                <Feature {...feature} index={index} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </BackgroundBeamsWithCollision>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 3) && "lg:border-l dark:border-neutral-800",
        index < 3 && "lg:border-b dark:border-neutral-800"
      )}>
      {index < 3 && (
        <div
          className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 3 && (
        <div
          className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div
        className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div
          className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-purple-500 dark:group-hover/feature:bg-purple-500 transition-all duration-200 origin-center" />
        <span
          className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p
        className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};