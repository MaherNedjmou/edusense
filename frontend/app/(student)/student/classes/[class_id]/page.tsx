"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import SectionsTab from "@/components/Sections/SectionsTab";
import api from "@/lib/api";

type ClassData = {
  _id: string;
  name: string;
  subject: string;
  description: string;
  code: string;
  color: string;
};

export default function StudentClassDetailPage() {
  const { class_id } = useParams() as { class_id: string };

  const [cls, setCls] = useState<ClassData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await api.get<any>(`/classes/${class_id}`);
        if (res.success) {
          setCls(res.data);
        } else {
          setError("Class not found.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load class.");
      } finally {
        setLoading(false);
      }
    };

    if (class_id) fetchClass();
  }, [class_id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 size={32} className="animate-spin text-primary/30" />
      </div>
    );
  }

  if (error || !cls) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-background">
        <p className="text-lg font-bold text-primary">{error || "Class not found."}</p>
        <Link
          href="/student/classes"
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
            href="/student/classes"
            className="flex items-center gap-1.5 text-sm font-medium text-primary/50 hover:text-primary transition-colors"
          >
            <ArrowLeft size={14} /> Classes
          </Link>
          <span className="text-primary/20">/</span>
          <span className="text-sm font-bold text-primary truncate">{cls.name}</span>
        </div>
      </div>

      {/* Banner */}
      <div className={`bg-gradient-to-br ${cls.color || "from-primary to-primary/80"} relative overflow-hidden h-44`}>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 40%, white 0%, transparent 55%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-2xl font-bold text-white">{cls.name}</h1>
          <p className="text-white/70 text-sm mt-0.5">{cls.subject}</p>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <SectionsTab
          cls={{
            id: cls._id,
            name: cls.name,
            description: cls.description || "",
            code: cls.code,
            studentCount: 0,
          }}
          classId={cls._id}
        />
      </div>
    </div>
  );
}