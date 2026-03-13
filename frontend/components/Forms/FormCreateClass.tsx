"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { BANNER_COLORS, CLASSES_DATA } from "@/data/classesData";
import Button from "@/components/UI/Button";

interface FormCreateClassProps {
  onClose: () => void;
  onClassCreated: (newClass: {
    id: string;
    name: string;
    subject: string;
    description: string;
    code: string;
    color: string;
    studentCount: number;
    sectionCount: number;
  }) => void;
}

export default function FormCreateClass({ onClose, onClassCreated }: FormCreateClassProps) {
  const [className, setClassName] = useState("");
  const [classSubject, setClassSubject] = useState("");
  const [classDesc, setClassDesc] = useState("");
  const [colorIdx, setColorIdx] = useState(0);

  const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

  const generateId = (name: string) =>
    name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const handleSubmit = () => {
    if (!className.trim()) return;

    const newId = generateId(className);
    const newClassData = {
      name: className,
      subject: classSubject || "General",
      description: classDesc,
      code: generateCode(),
      color: BANNER_COLORS[colorIdx],
      studentCount: 0,
    };

    CLASSES_DATA[newId] = newClassData;

    onClassCreated({ id: newId, ...newClassData, sectionCount: 0 });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary">Create New Class</h2>
          <button onClick={onClose} className="text-primary/60 rounded-full hover:bg-gray-500/20 hover:cursor-pointer p-1 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Banner Color Picker */}
        <div>
          <p className="text-xs font-semibold text-primary/40 uppercase tracking-wider mb-2">Banner Color</p>
          <div className="flex gap-2">
            {BANNER_COLORS.map((c, i) => (
              <button
                key={i}
                onClick={() => setColorIdx(i)}
                className={`w-7 h-7 rounded-full bg-linear-to-br ${c} transition-transform ${
                  colorIdx === i ? "scale-125 ring-2 ring-offset-2 ring-secondary" : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-primary/40 uppercase tracking-wider block mb-1.5">
              Class Name *
            </label>
            <input
              type="text"
              placeholder="e.g. grp 4 SDIA"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full border border-primary/20 rounded-xl px-3.5 py-2.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40 bg-background"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-primary/40 uppercase tracking-wider block mb-1.5">
              Subject
            </label>
            <input
              type="text"
              placeholder="e.g. Machine Learning"
              value={classSubject}
              onChange={(e) => setClassSubject(e.target.value)}
              className="w-full border border-primary/20 rounded-xl px-3.5 py-2.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40 bg-background"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-primary/40 uppercase tracking-wider block mb-1.5">
              Description
            </label>
            <textarea
              placeholder="What will students learn?"
              value={classDesc}
              onChange={(e) => setClassDesc(e.target.value)}
              rows={3}
              className="w-full border border-primary/20 rounded-xl px-3.5 py-2.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40 bg-background resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            className="flex-1"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1"
            variant="primary"
          >
            Create Class
          </Button>
        </div>

      </div>
    </div>
  );
}