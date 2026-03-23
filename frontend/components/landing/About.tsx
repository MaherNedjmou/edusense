"use client";

import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import Image from "next/image";
import about_pic from "@/public/images/about_pic.png";

const tabs = [
  {
    label: "SMART PIPELINE",
    note: "Processes exam sheets through layout detection, OCR, and structured data transformation for high accuracy.",
  },
  {
    label: "AI FEEDBACK",
    note: "Generates personalized feedback, identifies strengths and weaknesses, and explains mistakes clearly.",
  },
  {
    label: "ANALYTICS",
    note: "Provides performance insights, trends, and actionable data to improve student outcomes at scale.",
  },
];

export default function About() {
  const [activeTab, setActiveTab] = useState(0);

  // Auto-switch tabs every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % tabs.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full bg-background py-24 overflow-hidden">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-16">

        {/* LEFT — IMAGE */}
        <div className="flex-1 relative">
          <div className="absolute top-20 -right-40 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-20 w-56 h-56 bg-primary/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 w-full">
            <Image 
              src={about_pic} 
              alt="EduSense AI analyzing exam papers" 
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>

        {/* RIGHT — TEXT */}
        <div className="flex-1 space-y-8">

          {/* Badge */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <Info className="w-5 h-5 text-white" />
            </div>
            <span className="text-foreground/70 font-medium tracking-wide uppercase text-sm">
              About EduSense
            </span>
          </div>

          {/* Title */}
          <h2 className="text-5xl font-semibold leading-tight text-foreground">
            Transform Exam Papers Into <br />
            <span className="text-secondary">Actionable Insights</span>
          </h2>

          {/* Description */}
          <p className="text-lg text-foreground/75 max-w-xl leading-relaxed">
            EduSense leverages computer vision and AI to convert scanned exams into 
            structured data, evaluate student responses against model solutions, 
            and generate accurate grading, feedback, and performance insights automatically.
          </p>

          {/* Tabs */}
          <div className="flex border-foreground/10">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-6 py-3 font-semibold transition rounded-t-lg
                  ${
                    activeTab === index
                      ? "text-white bg-primary border-primary"
                      : "text-foreground/60 hover:text-secondary"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dynamic Note (with smooth transition feel) */}
          <p
            key={activeTab}
            className="text-sm text-foreground/60 max-w-lg transition-opacity duration-500"
          >
            {tabs[activeTab].note}
          </p>

        </div>

      </div>
    </section>
  );
}