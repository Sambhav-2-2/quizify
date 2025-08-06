import Link from "next/link";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/hero-section";
import { FeatureSection } from "@/components/feature-section";
import { BackgroundBeamsDemo } from "@/components/back-beam";
import { Slack } from "lucide-react";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeatureSection />
      <BackgroundBeamsDemo />
      <footer className="w-full border-t py-6 md:px-40">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row w-3/4 mx-auto">
          <div className="flex items-center gap-1 font-bold ">
            Quizify <Slack />
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Quizify All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Admin
            </Link>
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Student
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
