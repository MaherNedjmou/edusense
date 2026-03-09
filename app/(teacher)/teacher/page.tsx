"use client";

import { Upload, Users, School, FileText, Sparkles, UserPlus } from "lucide-react";
import SubmissionsChart from "@/components/Charts/SubmissionsChart";
import PerformanceDistributionChart from "@/components/Charts/PerformanceChart";
import StrengthWeaknessChart from "@/components/Charts/StrengthWeaknessChart";

export default function TeacherDashboard() {
  return (
    <div className="p-8 space-y-8 bg-background text-primary min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-primary/70">Overview of your classes and AI analysis.</p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-background border border-primary/20 text-primary px-4 py-2 rounded-xl hover:bg-secondary/10 transition">
            <UserPlus size={18} />
            Create Class
          </button>

          <button className="flex items-center gap-2 bg-secondary text-white px-5 py-2 rounded-xl shadow hover:opacity-90 transition">
            <Upload size={18} />
            Analyze Papers
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard icon={<School />} label="Classes" value="4" />
        <StatCard icon={<Users />} label="Students" value="96" />
        <StatCard icon={<FileText />} label="Submissions" value="210" />
        <StatCard icon={<Sparkles />} label="AI Analyses" value="210" />
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-background rounded-2xl shadow-sm p-6 border border-primary/10">
          <h2 className="font-semibold mb-4 text-primary">Submissions Over Time</h2>
          <SubmissionsChart />
        </div>

        <div className="bg-background rounded-2xl shadow-sm p-6 border border-primary/10">
          <h2 className="font-semibold mb-4 text-primary">Performance Distribution</h2>
          <PerformanceDistributionChart />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-background rounded-2xl shadow-sm p-6 border border-primary/10">
          <h2 className="font-semibold mb-4 text-primary">Strengths vs Weaknesses</h2>
          <StrengthWeaknessChart />
        </div>

        <div className="bg-background rounded-2xl shadow-sm p-6 border border-primary/10">
          <h2 className="font-semibold mb-6 text-primary">Recent Analyses</h2>

          <div className="space-y-4">
            <ActivityRow student="Amira Hassan" exam="Math Final" status="Completed" />
            <ActivityRow student="Karim Youssef" exam="Physics Test" status="Completed" />
            <ActivityRow student="Lina Samir" exam="Chemistry Quiz" status="Processing" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value } : { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-background p-6 rounded-2xl shadow-sm flex items-center justify-between border border-primary/10">
      <div>
        <p className="text-sm text-primary/70">{label}</p>
        <p className="text-2xl font-semibold mt-1 text-primary">{value}</p>
      </div>
      <div className="text-primary">{icon}</div>
    </div>
  );
}

function ActivityRow({ student, exam, status } : { student: string, exam: string, status: string }) {
  return (
    <div className="flex items-center justify-between border-b pb-3">
      <div>
        <p className="font-medium text-primary">{student}</p>
        <p className="text-sm text-primary/70">{exam}</p>
      </div>
      <span className="text-sm px-3 py-1 rounded-full bg-secondary/20 text-secondary">{status}</span>
    </div>
  );
}
