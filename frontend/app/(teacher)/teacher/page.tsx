"use client";
import { useState, useEffect } from "react";
import { Upload, Users, School, FileText, Sparkles, UserPlus, Loader2 } from "lucide-react";
import SubmissionsChart from "@/components/Charts/SubmissionsChart";
import PerformanceDistributionChart from "@/components/Charts/PerformanceChart";
import StrengthWeaknessChart from "@/components/Charts/StrengthWeaknessChart";
import Button from "@/components/UI/Button";
import { RECENT_ACTIVITIES } from "@/data/mockData";
import api from "@/lib/api";

export default function TeacherDashboard() {
  const [stats, setStats] = useState({
    classesCount: 0,
    studentsCount: 0,
    sectionsCount: 0,
    analysisCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get<{ data: any }>("/teachers/stats")
      .then(res => {
        if (res.data) setStats(res.data);
      })
      .catch(err => console.error("Error fetching stats:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const getIcon = (label: string) => {
    switch (label) {
      case "Classes": return <School />;
      case "Students": return <Users />;
      case "Submissions": return <FileText />;
      case "AI Analyses": return <Sparkles />;
      default: return <FileText />;
    }
  };

  const statItems = [
    { label: "Classes", value: stats.classesCount.toString() },
    { label: "Students", value: stats.studentsCount.toString() },
    { label: "Sections", value: stats.sectionsCount.toString() },
    { label: "AI Analyses", value: stats.analysisCount.toString() },
  ];

  return (
    <div className="p-8 space-y-8 bg-background text-primary min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-primary">Dashboard</h1>
          <p className="text-primary/70">Overview of your classes and AI analysis.</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline">
            <UserPlus size={18} />
            Create Class
          </Button>

          <Button variant="primary">
            <Upload size={18} />
            Analyze Papers
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={32} className="animate-spin text-primary/30" />
        </div>
      ) : (
        <div className="grid md:grid-cols-4 gap-6">
          {statItems.map((stat, i) => (
            <StatCard key={i} icon={getIcon(stat.label)} label={stat.label} value={stat.value} />
          ))}
        </div>
      )}

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-primary/10">
          <h2 className="font-semibold mb-4 text-primary">Submissions Over Time</h2>
          <SubmissionsChart />
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-primary/10">
          <h2 className="font-semibold mb-4 text-primary">Performance Distribution</h2>
          <PerformanceDistributionChart />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-primary/10">
          <h2 className="font-semibold mb-4 text-primary">Strengths vs Weaknesses</h2>
          <StrengthWeaknessChart />
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-primary/10">
          <h2 className="font-semibold mb-6 text-primary">Recent Analyses</h2>

          <div className="space-y-4">
            {RECENT_ACTIVITIES.map((activity, i) => (
              <ActivityRow key={i} {...activity} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center justify-between border border-primary/10">
      <div>
        <p className="text-sm text-primary/70">{label}</p>
        <p className="text-2xl font-semibold mt-1 text-primary">{value}</p>
      </div>
      <div className="text-primary">{icon}</div>
    </div>
  );
}

function ActivityRow({ student, exam, status }: {
  student: string;
  exam: string;
  status: string;
}) {
  const isProcessing = status === "Processing";
  return (
    <div className="flex items-center justify-between py-3 border-b border-primary/8 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-500/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
          {student.split(" ").map((n) => n[0]).join("")}
        </div>
        <div>
          <p className="text-sm font-semibold text-primary">{student}</p>
          <p className="text-xs text-primary/50">{exam}</p>
        </div>
      </div>
      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
        isProcessing ? "bg-accent/15 text-accent" : "bg-secondary/15 text-secondary"
      }`}>
        {status}
      </span>
    </div>
  );
}