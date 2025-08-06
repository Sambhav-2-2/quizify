import React from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export const metadata = {
  title: "Dashboard | Quizify",
  description: "Quizify is a platform for creating and taking exams and short quizzes.",
};


export default function DashboardLayout({ children }) {
  return <DashboardSidebar>{children}</DashboardSidebar>;
}