"use client";
import Link from "next/link";
import { Clipboard, Users, BookOpen, GraduationCap } from "lucide-react";

interface StudentClassCardProps {
  id: string;
  name: string;
  subject: string;
  description: string;
  code: string;
  color: string;
  studentCount: number;
  sectionCount: number;
}

export default function StudentClassCard({
  id,
  name,
  subject,
  description,
  code,
  color,
  studentCount,
  sectionCount,
}: StudentClassCardProps) {
  return (
    <Link href={`/student/classes/${id}`}>
      <div className="bg-white border border-primary/10 rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all group">
        {/* Banner */}
        <div className={`bg-linear-to-br ${color} h-24 p-4 flex flex-col justify-between relative overflow-hidden`}>
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 0%, transparent 50%)" }}
          />
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-white text-sm leading-tight line-clamp-2">{name}</h3>
              <p className="text-white/70 text-xs mt-0.5">{subject}</p>
            </div>
            <div className="bg-white/20 p-1.5 rounded-lg">
              <GraduationCap size={14} className="text-white" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-white/70 text-xs">
            <Users size={11} />
            <span>{studentCount} students</span>
          </div>
        </div>
        {/* Body */}
        <div className="p-4 space-y-3">
          <p className="text-xs text-primary/50 line-clamp-2 leading-relaxed">{description}</p>
          <div className="flex items-center justify-between pt-1 border-t border-primary/8">
            <div className="flex items-center gap-1 text-xs text-primary/40">
              <BookOpen size={12} />
              <span>{sectionCount} sections</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}