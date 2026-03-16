"use client";
import { useState, useEffect } from "react";
import { Upload, Users, School, FileText, Sparkles, UserPlus, Loader2 } from "lucide-react";
import SubmissionsChart from "@/components/Charts/SubmissionsChart";
import PerformanceDistributionChart from "@/components/Charts/PerformanceChart";
import StrengthWeaknessChart from "@/components/Charts/StrengthWeaknessChart";
import Button from "@/components/UI/Button";
import { RECENT_ACTIVITIES } from "@/data/mockData";
import api from "@/lib/api";
import FormCreateClass from "@/components/Forms/FormCreateClass";
import Link from "next/link";

export default function TeacherDashboard() {
  const [stats, setStats] = useState({
    classesCount: 0,
    studentsCount: 0,
    sectionsCount: 0,
    analysisCount: 0,
  });

  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get<{ data: any }>("/teachers/stats"),
      api.get<{ data: any[] }>("/teachers/analytics")
    ])
      .then(([statsRes, analyticsRes]) => {
        if (statsRes.data) setStats(statsRes.data);
        if (analyticsRes.data && analyticsRes.data.length > 0) {
          setAnalyticsData(analyticsRes.data);
          setSelectedClassId(analyticsRes.data[0].classId);
        }
      })
      .catch(err => console.error("Error fetching dashboard data:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const selectedAnalytics = analyticsData.find(a => a.classId === selectedClassId) || null;

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
          <Button variant="outline" onClick={() => setShowCreate(true)}>
            <UserPlus size={18} />
            Create Class
          </Button>

          <Link href="/teacher/analysis">
            <Button variant="primary">
              <Upload size={18} />
              Analyze Papers
            </Button>
          </Link>
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
      {analyticsData.length > 0 && (
        <div className="flex items-center gap-3">
          <label className="text-sm font-bold text-primary">Select Class: </label>
          <select
            value={selectedClassId}
            onChange={e => setSelectedClassId(e.target.value)}
            className="border border-primary/20 rounded-xl px-4 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer bg-white"
          >
            {analyticsData.map(a => (
              <option key={a.classId} value={a.classId}>{a.className}</option>
            ))}
          </select>
        </div>
      )}

      {selectedAnalytics ? (
        <>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-primary/10">
              <h2 className="font-semibold mb-4 text-primary">Student Exam Score per Class</h2>
              <SubmissionsChart data={selectedAnalytics.submissions} />
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-primary/10">
              <h2 className="font-semibold mb-4 text-primary">Pass vs Fail Rate (Top & Low Performers)</h2>
              <StrengthWeaknessChart pass={selectedAnalytics.passFail.pass} fail={selectedAnalytics.passFail.fail} />

              <div className="mt-6 flex flex-col gap-4">
                <div className="bg-green-50/50 p-3 rounded-lg border border-green-100">
                  <p className="text-xs font-bold text-green-700 uppercase mb-2">Top Performers</p>
                  {selectedAnalytics.topStudents.length > 0 ? selectedAnalytics.topStudents.map((s: any, i: number) => (
                    <div key={i} className="flex justify-between text-xs py-1 text-primary/70">
                      <span>{s.studentName} ({s.examTitle})</span>
                      <span className="font-bold">{s.score}%</span>
                    </div>
                  )) : <p className="text-xs text-primary/40 italic">Not enough data</p>}
                </div>
                <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                  <p className="text-xs font-bold text-amber-700 uppercase mb-2">Requires Attention</p>
                  {selectedAnalytics.lowestStudents.length > 0 ? selectedAnalytics.lowestStudents.map((s: any, i: number) => (
                    <div key={i} className="flex justify-between text-xs py-1 text-primary/70">
                      <span>{s.studentName} ({s.examTitle})</span>
                      <span className="font-bold">{s.score}%</span>
                    </div>
                  )) : <p className="text-xs text-primary/40 italic">Not enough data</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-primary/10 h-full flex flex-col">
              <h2 className="font-semibold mb-4 text-primary">Performance Distribution</h2>
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-sm">
                  <PerformanceDistributionChart data={selectedAnalytics.distribution} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-primary/10">
              <h2 className="font-semibold mb-6 text-primary">Recent Analyses</h2>
              <div className="space-y-4">
                {selectedAnalytics.recentAnalyses.length > 0 ? selectedAnalytics.recentAnalyses.map((activity: any, i: number) => (
                  <ActivityRow key={i} student={activity.studentName} exam={activity.examTitle} status={activity.status} />
                )) : (
                  <p className="text-sm text-primary/40 italic text-center py-4">No recent activities for this class.</p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        !isLoading && <p className="text-center py-10 text-primary/50">No class data available.</p>
      )}

      {/* Create Modal */}
      {showCreate && (
        <FormCreateClass
          onClose={() => setShowCreate(false)}
          onClassCreated={() => (console.log("Class created"))}
        />
      )}
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
  const isProcessing = status === "Not Processed";
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
      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${isProcessing ? "bg-accent/15 text-accent" : "bg-secondary/15 text-secondary"
        }`}>
        {status}
      </span>
    </div>
  );
}