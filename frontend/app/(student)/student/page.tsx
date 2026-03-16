"use client";

import { FileText, School, Sparkles } from "lucide-react";

import SubjectPerformanceChart from "@/components/Charts/SubjectPerformanceChart";
import ScoreDistributionChart from "@/components/Charts/ScoreDistributionChart";


export default function StudentDashboard() {

  const stats = [
    { label: "Classes", value: "3", icon: <School /> },
    { label: "Submissions", value: "8", icon: <FileText /> },
    { label: "AI Analyses", value: "6", icon: <Sparkles /> },
    { label: "Average Score", value: "78%", icon: <FileText /> }
  ];

  const submissionsData = [
    { exam: "Math Test 1", score: 72 },
    { exam: "Physics Quiz", score: 81 },
    { exam: "Algorithms Exam", score: 84 },
    { exam: "Math Test 2", score: 76 }
  ];

  const distribution = {
    excellent: 2,
    good: 3,
    average: 2,
    weak: 1
  };

  const recentFeedbacks = [
    {
      exam: "Math Test 2",
      feedback: "Good algebra understanding but some mistakes in calculus.",
      score: 76
    },
    {
      exam: "Physics Quiz",
      feedback: "Strong conceptual answers but calculation errors.",
      score: 81
    }
  ];

  const recentSubmissions = [
    { exam: "Algorithms Midterm", status: "Processing" },
    { exam: "Math Test 2", status: "Analyzed" }
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

      </div>

      {/* Stats */}

      <div className="grid md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
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

          <SubjectPerformanceChart data={submissionsData} />

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

            {recentFeedbacks.map((item, i) => (
              <FeedbackCard
                key={i}
                exam={item.exam}
                feedback={item.feedback}
                score={item.score}
              />
            ))}

          </div>

        </div>

        {/* Submissions */}

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-primary/10">

          <h2 className="font-semibold mb-6 text-primary">
            Latest Submissions
          </h2>

          <div className="space-y-4">

            {recentSubmissions.map((item, i) => (
              <SubmissionRow
                key={i}
                exam={item.exam}
                status={item.status}
              />
            ))}

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