"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Award, Clock, FileText, Brain, BarChart3 } from "lucide-react";

export function FloatingQuizElements() {
  const [elements, setElements] = useState([]);
  
  useEffect(() => {
    const quizItems = [];
    const icons = [Check, Award, Clock, FileText, Brain, BarChart3];
    
    for (let i = 0; i < 15; i++) {
      const IconComponent = icons[Math.floor(Math.random() * icons.length)];
      quizItems.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        scale: 0.5 + Math.random() * 1.5,
        rotate: Math.random() * 360,
        opacity: 0.1 + Math.random() * 0.4,
        icon: <IconComponent size={24} />,
      });
    }
    
    setElements(quizItems);
  }, []);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {elements.map((item) => (
        <motion.div
          key={item.id}
          className="absolute text-purple-500 dark:text-purple-400"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            opacity: item.opacity,
          }}
          initial={{ scale: 0, rotate: item.rotate }}
          animate={{
            scale: item.scale,
            rotate: item.rotate + 360,
            y: [0, -20, 0, 20, 0],
            x: [0, 15, 0, -15, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 25,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {item.icon}
        </motion.div>
      ))}
    </div>
  );
}