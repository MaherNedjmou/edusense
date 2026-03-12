"use client";

import { Plus, MoreVertical } from "lucide-react";
import { MOCK_STUDENTS } from "@/data/classesData";
import Button from "@/components/UI/Button";

interface PeopleTabProps {
  cls: {
    studentCount: number;
  };
}

export default function PeopleTab({ cls }: PeopleTabProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white border border-primary/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-primary/8 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest">
            Students · {cls.studentCount}
          </p>
          <Button variant="outline" className="text-xs">
            <Plus size={12} /> Invite
          </Button>
        </div>
        <div className="divide-y divide-primary/8">
          {MOCK_STUDENTS.map((name, i) => (
            <div
              key={i}
              className="px-6 py-3.5 flex items-center gap-3 hover:bg-primary/3 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gray-500/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                {name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-primary">{name}</p>
                <p className="text-xs text-primary/40">
                  {name.toLowerCase().replace(" ", ".")}@school.edu
                </p>
              </div>
              <button className="text-primary/30 hover:text-primary transition-colors p-1">
                <MoreVertical size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}