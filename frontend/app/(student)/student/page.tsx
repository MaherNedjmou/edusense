"use client";

import { useEffect, useState } from "react";
import { FileText, School, Sparkles, Loader2 } from "lucide-react";

import SubjectPerformanceChart from "@/components/Charts/SubjectPerformanceChart";
import ScoreDistributionChart from "@/components/Charts/ScoreDistributionChart";
import api from "@/lib/api";

type DashboardStats = {
  classCount: number;
  submissionCount: number;
  analysisCount: number;
  averageScore: number;
};

type SubmissionPoint = { exam: string; score: number };

type Distribution = {
  excellent: number;
  good: number;
  average: number;
  weak: number;
};

type FeedbackItem = { exam: string; feedback: string; score: number };
type SubmissionItem = { exam: string; status: string };

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    classCount: 0,
    submissionCount: 0,
    analysisCount: 0,
    averageScore: 0,
  });
  const [submissionsData, setSubmissionsData] = useState<SubmissionPoint[]>([]);
  const [distribution, setDistribution] = useState<Distribution>({
    excellent: 0, good: 0, average: 0, weak: 0,
  });
  const [recentFeedbacks, setRecentFeedbacks] = useState<FeedbackItem[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<SubmissionItem[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get<any>("/student-classes/my-stats");
        if (res.success) {
          const d = res.data;
          setStats(d.stats);
          setSubmissionsData(d.submissionsData || []);
          setDistribution(d.distribution || { excellent: 0, good: 0, average: 0, weak: 0 });
          setRecentFeedbacks(d.recentFeedbacks || []);
          setRecentSubmissions(d.recentSubmissions || []);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: "Classes", value: loading ? "—" : String(stats.classCount), icon: <School /> },
    { label: "Submissions", value: loading ? "—" : String(stats.submissionCount), icon: <FileText /> },
    { label: "AI Analyses", value: loading ? "—" : String(stats.analysisCount), icon: <Sparkles /> },
    { label: "Average Score", value: loading ? "—" : `${stats.averageScore}%`, icon: <FileText /> },
  ];

  return (
    <div className="p-8 space-y-8 bg-background text-primary min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-primary">
            Dashboard
          </h1>

          <p className="text-primary/70">
            Overview of your submissions and performance.
          </p>
        </div>

        {loading && (
          <Loader2 size={20} className="animate-spin text-primary/30" />
        )}
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <StatCard
            key={i}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Score Progress */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-primary/10">
          <h2 className="font-semibold mb-4 text-primary">
            Score Progression
          </h2>

          {submissionsData.length === 0 && !loading ? (
            <div className="flex items-center justify-center h-32 text-primary/30 text-sm">
              No submissions yet
            </div>
          ) : (
            <SubjectPerformanceChart data={submissionsData} />
          )}
        </div>

        {/* Distribution */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-primary/10">
          <h2 className="font-semibold mb-4 text-primary">
            Score Distribution
          </h2>

          <ScoreDistributionChart
            excellent={distribution.excellent}
            good={distribution.good}
            average={distribution.average}
            weak={distribution.weak}
          />
        </div>

      </div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Feedback */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-primary/10">
          <h2 className="font-semibold mb-6 text-primary">
            Recent AI Feedback
          </h2>

          <div className="space-y-4">
            {recentFeedbacks.length === 0 ? (
              <p className="text-sm text-primary/40 text-center py-6">
                No AI feedback yet
              </p>
            ) : (
              recentFeedbacks.map((item, i) => (
                <FeedbackCard
                  key={i}
                  exam={item.exam}
                  feedback={item.feedback}
                  score={item.score}
                />
              ))
            )}
          </div>
        </div>

        {/* Submissions */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-primary/10">
          <h2 className="font-semibold mb-6 text-primary">
            Latest Submissions
          </h2>

          <div className="space-y-4">
            {recentSubmissions.length === 0 ? (
              <p className="text-sm text-primary/40 text-center py-6">
                No submissions yet
              </p>
            ) : (
              recentSubmissions.map((item, i) => (
                <SubmissionRow
                  key={i}
                  exam={item.exam}
                  status={item.status}
                />
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}



function StatCard({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center justify-between border border-primary/10">

      <div>
        <p className="text-sm text-primary/70">
          {label}
        </p>

        <p className="text-2xl font-semibold mt-1 text-primary">
          {value}
        </p>
      </div>

      <div className="text-primary">
        {icon}
      </div>

    </div>
  );
}



function FeedbackCard({
  exam,
  feedback,
  score
}: {
  exam: string;
  feedback: string;
  score: number;
}) {

  return (
    <div className="border border-primary/10 rounded-xl p-4">

      <div className="flex justify-between mb-2">

        <p className="font-semibold text-primary">
          {exam}
        </p>

        <span className="text-sm font-bold text-secondary">
          {score}%
        </span>

      </div>

      <p className="text-sm text-primary/70">
        {feedback}
      </p>

    </div>
  );
}



function SubmissionRow({
  exam,
  status
}: {
  exam: string;
  status: string;
}) {

  const isProcessing = status === "Processing";

  return (
    <div className="flex justify-between items-center border-b border-primary/10 pb-3 last:border-0">

      <p className="text-sm text-primary">
        {exam}
      </p>

      <span
        className={`text-xs px-3 py-1 rounded-full font-semibold ${
          isProcessing
            ? "bg-accent/20 text-accent"
            : "bg-secondary/20 text-secondary"
        }`}
      >
        {status}
      </span>

    </div>
  );
}