"use client";

import React from 'react';
import { BookOpen, GraduationCap, Clock, FileText, CheckCircle } from "lucide-react";
import { DASHBOARD_STATS, STUDENT_COURSES, RECENT_ACTIVITIES } from "@/data/mockData";
import Button from "@/components/UI/Button";

export default function StudentDashboard() {
  return (
    <div className="p-8 space-y-8 bg-background text-primary min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">Student Dashboard</h1>
          <p className="text-primary/70">Welcome back! Here's an overview of your academic progress.</p>
        </div>
        <Button variant="primary">
          <BookOpen size={18} />
          View All Courses
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        {DASHBOARD_STATS.student.map((stat, i) => (
          <StatCard 
            key={i} 
            icon={getIcon(stat.label)} 
            label={stat.label} 
            value={stat.value} 
          />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Enrolled Courses */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-primary/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-primary">Enrolled Classes</h2>
            <button className="text-xs font-bold text-secondary hover:underline transition-all uppercase tracking-widest">
              View Schedule
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {STUDENT_COURSES.map((course) => (
              <div key={course.id} className="group cursor-pointer">
                <div className={`h-32 bg-linear-to-br ${course.color} rounded-xl p-4 flex flex-col justify-end transition-transform group-hover:scale-[1.02] shadow-sm`}>
                  <h3 className="text-white font-bold">{course.name}</h3>
                  <p className="text-white/70 text-xs">{course.teacher}</p>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-primary/50 font-medium">Progress</span>
                    <span className="text-primary font-bold">{course.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-primary/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-secondary rounded-full transition-all duration-500" 
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-primary/10">
          <h2 className="font-semibold mb-6 text-primary">Recent Feedback</h2>
          <div className="space-y-4">
            {RECENT_ACTIVITIES.slice(0, 4).map((activity, i) => (
              <div key={i} className="flex items-start gap-3 py-3 border-b border-primary/5 last:border-0 hover:bg-primary/3 px-2 rounded-xl transition-colors cursor-pointer">
                <div className="bg-secondary/10 p-2 rounded-xl shrink-0">
                  <CheckCircle size={16} className="text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">{activity.exam}</p>
                  <p className="text-xs text-primary/40 mt-0.5">Feedback available · {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2.5 text-xs font-bold text-primary/50 hover:text-primary bg-primary/3 rounded-xl transition-all">
            View All Feedback
          </button>
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
      <div className="text-primary/40">{icon}</div>
    </div>
  );
}

function getIcon(label: string) {
  switch (label) {
    case "Enrolled Classes": return <GraduationCap size={20} />;
    case "Assignments Done": return <FileText size={20} />;
    case "Avg. Grade": return <CheckCircle size={20} />;
    case "AI Feedbacks": return <Clock size={20} />;
    default: return <FileText size={20} />;
  }
}