"use client";

import { useEffect, useState } from "react";
import { Loader2, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";
import StudentClassCard from "@/components/UI/StudentClassCard";
import Button from "@/components/UI/Button";
import api from "@/lib/api";

type ClassType = {
  _id: string;
  name: string;
  subject: string;
  description: string;
  code: string;
  color: string;
  studentCount?: number;
  sectionCount?: number;
};

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [joinId, setJoinId] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [joinSuccess, setJoinSuccess] = useState("");

  const fetchClasses = async () => {
    try {
      const res = await api.get<any>("/student-classes/my");
      if (res.success) {
        setClasses(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch classes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleJoin = async () => {
    if (!joinId.trim()) return;
    setJoinError("");
    setJoinSuccess("");
    setJoinLoading(true);

    try {
      await api.post<any>("/student-classes/join", { classId: joinId.trim() });
      setJoinSuccess("Successfully joined the class!");
      setJoinId("");
      fetchClasses(); // refresh list
      setTimeout(() => setJoinSuccess(""), 3000);
    } catch (err: any) {
      setJoinError(err.message || "Failed to join class.");
    } finally {
      setJoinLoading(false);
    }
  };

  return (
    <div className="p-8 bg-background min-h-screen space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary">My Classes</h1>
        <p className="text-primary/70">
          {isLoading ? "Loading..." : `${classes.length} enrolled class${classes.length !== 1 ? "es" : ""}`}
        </p>
      </div>

      {/* Join Class */}
      <div className="flex justify-center">
        <div className="max-w-md bg-white border border-primary/10 rounded-xl p-6 space-y-4 shadow-sm w-full">
          <h2 className="text-lg font-semibold text-primary">
            Join a Class
          </h2>

          <p className="text-sm text-primary/60">
            Enter the class ID provided by your teacher.
          </p>

          <div className="flex gap-3">
            <input
              type="text"
              value={joinId}
              onChange={(e) => { setJoinId(e.target.value); setJoinError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              placeholder="Enter class ID"
              className="flex-1 border border-primary/20 rounded-lg px-4 py-2 outline-none font-mono tracking-wider focus:ring-2 focus:ring-primary/20"
            />

            <Button onClick={handleJoin} disabled={joinLoading || !joinId.trim()}>
              {joinLoading ? <Loader2 size={16} className="animate-spin" /> : (
                <>Join <ArrowRight size={18} /></>
              )}
            </Button>
          </div>

          {/* Feedback messages */}
          {joinError && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <AlertCircle size={14} className="shrink-0" />
              {joinError}
            </div>
          )}
          {joinSuccess && (
            <div className="flex items-center gap-2 text-sm text-secondary bg-secondary/5 border border-secondary/20 rounded-lg px-3 py-2">
              <CheckCircle size={14} className="shrink-0" />
              {joinSuccess}
            </div>
          )}
        </div>
      </div>

      {/* Classes Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={32} className="animate-spin text-primary/30" />
        </div>
      ) : classes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <p className="font-bold text-primary text-lg">No classes yet</p>
          <p className="text-sm text-primary/40 max-w-xs">
            Ask your teacher for a class ID and join your first class above.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {classes.map((cls) => (
            <StudentClassCard
              key={cls._id}
              id={cls._id}
              name={cls.name}
              subject={cls.subject || ""}
              description={cls.description || ""}
              color={cls.color || "from-primary to-primary/80"}
              studentCount={cls.studentCount || 0}
              code={cls.code}
              sectionCount={cls.sectionCount || 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}