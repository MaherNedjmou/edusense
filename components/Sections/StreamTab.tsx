"use client";

import { useState } from "react";
import {
  Plus, Upload, FileText, Brain, X,
  Clipboard, Users, BookOpen,
  CheckCircle, GraduationCap, Sparkles, Crown,
} from "lucide-react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Button from "@/components/UI/Button";

interface Section {
  id: number;
  title: string;
  description: string;
  modelSolutionName?: string;
}

interface StreamTabProps {
  cls: {
    name: string;
    description: string;
    code: string;
    studentCount: number;
  };
}

export default function StreamTab({ cls }: StreamTabProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [showAddSection, setShowAddSection] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionDesc, setSectionDesc] = useState("");
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(cls.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const addSection = () => {
    if (!sectionTitle.trim()) return;
    const newSec: Section = { id: Date.now(), title: sectionTitle, description: sectionDesc };
    setSections((prev) => [...prev, newSec]);
    setExpandedIds((prev) => [...prev, newSec.id]);
    setSectionTitle("");
    setSectionDesc("");
    setShowAddSection(false);
  };

  const removeSection = (id: number) =>
    setSections((prev) => prev.filter((s) => s.id !== id));

  const toggleExpand = (id: number) =>
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  const handleModelUpload = (sectionId: number, files: FileList | null) => {
    if (!files?.length) return;
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, modelSolutionName: files[0].name } : s
      )
    );
  };

  return (
    <div className="grid lg:grid-cols-4 gap-6">

      {/* Sidebar */}
      <div className="space-y-4">
        <div className="bg-white border border-primary/10 rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-3">Class Code</p>
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-xl text-primary">{cls.code}</span>
            <button
              onClick={copyCode}
              className="flex items-center gap-1.5 text-xs text-secondary font-semibold hover:opacity-80 transition-opacity"
            >
              {copied ? <CheckCircle size={14} /> : <Clipboard size={14} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className="bg-white border border-primary/10 rounded-2xl p-4 shadow-sm space-y-3">
          <p className="text-xs font-bold text-primary/40 uppercase tracking-widest">Overview</p>
          <div className="flex items-center gap-3">
            <div className="bg-secondary/10 p-2 rounded-xl"><Users size={14} /></div>
            <div>
              <p className="text-xs text-primary/40">Students</p>
              <p className="text-sm font-bold text-primary">{cls.studentCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 p-2 rounded-xl"><BookOpen size={14} /></div>
            <div>
              <p className="text-xs text-primary/40">Sections</p>
              <p className="text-sm font-bold text-primary">{sections.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main feed */}
      <div className="lg:col-span-3 space-y-5">

        {/* Welcome card */}
        <div className="bg-white border border-primary/10 rounded-2xl p-5 shadow-sm flex items-start gap-4">
          <div className="bg-secondary/10 p-3 rounded-2xl shrink-0"><GraduationCap size={20} /></div>
          <div>
            <h3 className="font-bold text-primary mb-1">Welcome to {cls.name}</h3>
            <p className="text-sm text-primary/55 leading-relaxed">{cls.description}</p>
          </div>
        </div>

        {/* Sections header */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest">Sections</p>
          <Button variant="primary" onClick={() => setShowAddSection(true)} className="text-xs">
            <Plus size={12} /> Add Section
          </Button>
        </div>

        {/* Empty state */}
        {sections.length === 0 && !showAddSection && (
          <div className="bg-white border border-primary/10 rounded-2xl p-10 shadow-sm flex flex-col items-center text-center">
            <div className="bg-primary/5 p-4 rounded-2xl mb-4"><Sparkles size={28} className="text-primary/30" /></div>
            <p className="font-bold text-primary">No sections yet</p>
            <p className="text-sm text-primary/40 mt-1 max-w-xs">
              Create your first section to start organizing classwork and uploading model solutions.
            </p>
          </div>
        )}

        {/* Sections list */}
        {sections.map((sec) => {
          const isExpanded = expandedIds.includes(sec.id);
          return (
            <div key={sec.id} className="bg-white border border-primary/10 rounded-2xl shadow-sm overflow-hidden">
              <div
                onClick={() => toggleExpand(sec.id)}
                className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-primary/3 transition-colors border-b border-primary/8 group"
              >
                <div className="bg-secondary/10 p-2 rounded-xl shrink-0">
                  <BookOpen size={15} className="text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-primary text-sm">{sec.title}</h3>
                  {sec.description && (
                    <p className="text-xs text-primary/40 truncate mt-0.5">{sec.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); removeSection(sec.id); }}
                    className="opacity-0 group-hover:opacity-100 text-primary/30 hover:text-red-500 transition-all p-1 rounded-lg hover:bg-red-50"
                  >
                    <X size={14} />
                  </button>
                  {isExpanded
                    ? <ChevronUp size={16} className="text-primary/40" />
                    : <ChevronDown size={16} className="text-primary/40" />
                  }
                </div>
              </div>

              {isExpanded && (
                <div className="p-5 space-y-5">
                  <div className="border border-dashed border-primary/15 rounded-xl p-4 text-center">
                    <p className="text-xs text-primary/40">No student submissions yet</p>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-2.5">Model Solution</p>
                    {sec.modelSolutionName ? (
                      <div className="flex items-center gap-3 bg-secondary/5 border border-secondary/20 rounded-xl px-4 py-3">
                        <div className="bg-secondary/10 p-2 rounded-lg shrink-0">
                          <FileText size={16} className="text-secondary" />
                        </div>
                        <p className="text-sm font-semibold text-primary flex-1 truncate">{sec.modelSolutionName}</p>
                        <CheckCircle size={16} className="text-secondary shrink-0" />
                      </div>
                    ) : (
                      <label className="flex items-center gap-3 border border-dashed border-primary/20 rounded-xl px-4 py-3 cursor-pointer hover:border-secondary/40 hover:bg-secondary/5 transition-all group">
                        <div className="bg-primary/5 group-hover:bg-secondary/10 p-2 rounded-lg transition-colors shrink-0">
                          <Upload size={15} className="text-primary/40 group-hover:text-secondary transition-colors" />
                        </div>
                        <span className="text-sm text-primary/50 group-hover:text-primary transition-colors">
                          Upload model solution · <span className="text-secondary font-semibold">Browse</span>
                        </span>
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          className="hidden"
                          onChange={(e) => handleModelUpload(sec.id, e.target.files)}
                        />
                      </label>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-1 border-t border-primary/8">
                    <button
                      disabled={!sec.modelSolutionName}
                      onClick={() => alert(`Running AI analysis for: ${sec.title}`)}
                      className={`flex items-center gap-2 bg-secondary text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-md shadow-secondary/30 ${!sec.modelSolutionName ? "opacity-40 cursor-not-allowed" : ""}`}
                    >
                      <Brain size={15} /> Analyze Section
                    </button>
                    <div className="flex items-center gap-2 border border-accent/30 bg-accent/5 rounded-xl px-3 py-2">
                      <Crown size={13} className="text-accent" />
                      <span className="text-xs font-semibold text-primary/60">
                        Bulk on <span className="text-accent font-bold">Pro</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Add section inline form */}
        {showAddSection && (
          <div className="bg-white border border-secondary/30 rounded-2xl shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-primary">New Section</p>
              <button
                onClick={() => setShowAddSection(false)}
                className="text-primary/40 hover:bg-gray-500/20 rounded-full p-1"
              >
                <X size={16} />
              </button>
            </div>
            <input
              autoFocus
              type="text"
              placeholder="Section title *"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              className="w-full border border-primary/20 rounded-xl px-3.5 py-2.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40 bg-background"
            />
            <textarea
              placeholder="Instructions for students (optional)"
              value={sectionDesc}
              onChange={(e) => setSectionDesc(e.target.value)}
              rows={2}
              className="w-full border border-primary/20 rounded-xl px-3.5 py-2.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40 bg-background resize-none"
            />
            <div className="flex gap-3">
              <Button onClick={() => setShowAddSection(false)} variant="outline" className="text-xs flex-1">
                Cancel
              </Button>
              <Button onClick={addSection} variant="primary" className="text-xs flex-1">
                Add
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}