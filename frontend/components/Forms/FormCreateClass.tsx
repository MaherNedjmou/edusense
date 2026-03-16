"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { BANNER_COLORS } from "@/data/classesData";
import Button from "@/components/UI/Button";
import api from "@/lib/api";

interface FormCreateClassProps {
  onClose: () => void;
  onClassCreated: (newClass: any) => void;
}

export default function FormCreateClass({ onClose, onClassCreated }: FormCreateClassProps) {
  const [className, setClassName] = useState("");
  const [classSubject, setClassSubject] = useState("");
  const [classDesc, setClassDesc] = useState("");
  const [colorIdx, setColorIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!className.trim()) return;
    setIsLoading(true);
    setError("");

    try {
      const payload = {
        name: className,
        subject: classSubject || "General",
        description: classDesc,
        color: BANNER_COLORS[colorIdx]
      };



      const res = await api.post<any>("/classes", payload);
      
      if (res.success) {
        onClassCreated({ ...res.data, studentCount: 0, sectionCount: 0 });
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "Failed to create class.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary">Create New Class</h2>
          <button onClick={onClose} disabled={isLoading} className="text-primary/60 rounded-full hover:bg-gray-500/20 hover:cursor-pointer p-1 transition-colors">
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
                type="button"
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

        {error && (
          <div className="text-red-500 text-xs font-medium px-1">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            className="flex-1"
            variant="outline"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 flex items-center justify-center gap-2"
            variant="primary"
            disabled={isLoading || !className.trim()}
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            <span>Create Class</span>
          </Button>
        </div>

      </div>
    </div>
  );
}
