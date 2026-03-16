"use client";

import { useEffect, useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import StudentClassCard from "@/components/UI/StudentClassCard";
import { CLASSES_DATA } from "@/data/classesData";
import Button from "@/components/UI/Button";

type ClassType = {
  id: string;
  name: string;
  subject: string;
  description: string;
  code: string;
  color: string;
  studentCount: number;
};

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [joinCode, setJoinCode] = useState("");

  useEffect(() => {
    const data = Object.entries(CLASSES_DATA).map(([id, cls]) => ({
      id,
      ...cls,
    }));

    setTimeout(() => {
      setClasses(data);
      setIsLoading(false);
    }, 10);
  }, []);

  return (
    <div className="p-8 bg-background min-h-screen space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary">My Classes</h1>
        <p className="text-primary/70">
          {classes.length} available classes
        </p>
      </div>

      {/* Join Class */}
      <div className="flex justify-center">
        <div className="max-w-md bg-white border border-primary/10 rounded-xl p-6 space-y-4 shadow-sm w-full">
          <h2 className="text-lg font-semibold text-primary">
            Join a Class
          </h2>

          <p className="text-sm text-primary/60">
            Enter the class code provided by your teacher.
          </p>

          <div className="flex gap-3">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Enter class code"
              className="flex-1 border border-primary/20 rounded-lg px-4 py-2 outline-none font-mono tracking-wider focus:ring-2 focus:ring-primary/20"
            />

            <Button>
              Join
                <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* Classes Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={32} className="animate-spin text-primary/30" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {classes.map((cls) => (
            <StudentClassCard
              key={cls.id}
              id={cls.id}
              name={cls.name}
              subject={cls.subject}
              description={cls.description}
              color={cls.color}
              studentCount={cls.studentCount}
              code={cls.code} 
              sectionCount={0}             
            />
          ))}
        </div>
      )}
    </div>
  );
}