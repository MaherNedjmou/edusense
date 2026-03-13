"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CLASSES_DATA } from "@/data/classesData";
import StreamTab from "@/components/Sections/StreamTab";
import PeopleTab from "@/components/Sections/PeopleTab";

type Tab = "stream" | "students";

const TABS: { key: Tab; label: string }[] = [
  { key: "stream", label: "Stream" },
  { key: "students", label: "students" },
];

export default function ClassDetailPage() {
  const params = useParams();
  const class_id = params["class_id"] as string;
  const cls = CLASSES_DATA[class_id];

  const [activeTab, setActiveTab] = useState<Tab>("stream");

  if (!cls) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-background">
        <p className="text-lg font-bold text-primary">Class not found.</p>
        <p className="text-sm text-primary/40">
          ID received: <code className="bg-primary/10 px-2 py-0.5 rounded">{class_id}</code>
        </p>
        <Link
          href="/teacher/classes"
          className="text-sm font-bold text-secondary hover:underline flex items-center gap-1"
        >
          <ArrowLeft size={14} /> Back to Classes
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-primary/10 sticky top-0 z-30">
        <div className="px-6 flex items-center gap-2 h-12">
          <Link
            href="/teacher/classes"
            className="flex items-center gap-1.5 text-sm font-medium text-primary/50 hover:text-primary transition-colors"
          >
            <ArrowLeft size={14} /> Classes
          </Link>
          <span className="text-primary/20">/</span>
          <span className="text-sm font-bold text-primary truncate">{cls.name}</span>
        </div>
      </div>

      {/* Banner */}
      <div className={`bg-linear-to-br ${cls.color} relative overflow-hidden h-44`}>
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 70% 40%, white 0%, transparent 55%)" }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-2xl font-bold text-white">{cls.name}</h1>
          <p className="text-white/70 text-sm mt-0.5">{cls.subject}</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-white border-b border-primary/10 px-6">
        <div className="flex items-center gap-1 max-w-6xl mx-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3.5 text-sm font-semibold border-b-2 cursor-pointer transition-colors ${
                activeTab === tab.key
                  ? "border-secondary text-secondary"
                  : "border-transparent text-primary/50 hover:text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {activeTab === "stream" && <StreamTab cls={cls} />}
        {activeTab === "students" && <PeopleTab cls={cls} />}
      </div>

    </div>
  );
}