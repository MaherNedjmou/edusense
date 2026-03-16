"use client";

import { useState } from "react";
import {
  FileText, Upload, BookOpen, GraduationCap,
  Sparkles, Users, CheckCircle, X, ChevronDown, ChevronUp,
} from "lucide-react";

const MOCK_SECTIONS = [
  {
    id: "1",
    title: "Chapter 1 – Newton's Laws",
    description: "Review all three laws and solve the attached problems.",
    examImages: [
      { url: "https://example.com/files/newton-homework.pdf", public_id: "newton-hw" },
    ],
    solutionImages: [
      { url: "https://example.com/files/newton-solution.pdf", public_id: "newton-sol" },
    ],
  },
  {
    id: "2",
    title: "Chapter 2 – Kinematics",
    description: "Focus on projectile motion. Show all working steps.",
    examImages: [
      { url: "https://example.com/files/kinematics-hw.pdf", public_id: "kine-hw" },
    ],
    solutionImages: [],
  },
  {
    id: "3",
    title: "Chapter 3 – Work & Energy",
    description: "Problems cover conservation of energy and power calculations.",
    examImages: [],
    solutionImages: [],
  },
];

// ── Types ────────────────────────────────────────────────────────────────────
interface ImageFile {
  url: string;
  public_id: string;
}

interface Section {
  id: string;
  title: string;
  description: string;
  examImages: ImageFile[];
  solutionImages: ImageFile[];
}

interface SectionsTabProps {
  cls: {
    id: string;
    name: string;
    description: string;
    code: string;
    studentCount: number;
  };
  classId: string;
}

// ── Component ────────────────────────────────────────────────────────────────
export default function SectionsTab({ cls, classId }: SectionsTabProps) {
  const sections: Section[] = MOCK_SECTIONS;

  const [expandedIds, setExpandedIds] = useState<string[]>([MOCK_SECTIONS[0].id]);

  // Per-section submission state: { [sectionId]: File[] }
  const [submissions, setSubmissions] = useState<Record<string, File[]>>({});
  // Per-section submitted state: { [sectionId]: boolean }
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) =>
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  const handleFileSelect = (sectionId: string, files: FileList | null) => {
    if (!files?.length) return;
    setSubmissions((prev) => ({
      ...prev,
      [sectionId]: [...(prev[sectionId] ?? []), ...Array.from(files)],
    }));
  };

  const removeSelectedFile = (sectionId: string, index: number) => {
    setSubmissions((prev) => ({
      ...prev,
      [sectionId]: (prev[sectionId] ?? []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (sectionId: string) => {
    if (!submissions[sectionId]?.length) return;
    // TODO: replace with real API call
    setSubmitted((prev) => ({ ...prev, [sectionId]: true }));
  };

  return (
    <div className="grid lg:grid-cols-4 gap-6">

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <div className="space-y-4">

        {/* Class code (view only) */}
        <div className="bg-white border border-primary/10 rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-3">Class Code</p>
          <span className="font-mono font-bold text-xl text-primary">{cls.code}</span>
        </div>

        {/* Overview */}
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

      {/* ── Main feed ───────────────────────────────────────────────────── */}
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
        <p className="text-xs font-bold uppercase tracking-widest text-primary/40">Sections</p>

        {/* Empty state */}
        {sections.length === 0 && (
          <div className="bg-white border border-primary/10 rounded-2xl p-10 shadow-sm flex flex-col items-center text-center">
            <div className="bg-primary/5 p-4 rounded-2xl mb-4"><Sparkles size={28} className="text-primary/30" /></div>
            <p className="font-bold text-primary">No sections yet</p>
            <p className="text-sm text-primary/40 mt-1 max-w-xs">
              Your teacher hasn't added any sections yet. Check back later.
            </p>
          </div>
        )}

        {/* Sections list */}
        {sections.map((sec) => {
          const isExpanded = expandedIds.includes(sec.id);
          const solutionFiles = sec.solutionImages ?? [];
          const homeworkFiles = sec.examImages ?? [];
          const selectedFiles = submissions[sec.id] ?? [];
          const isSubmitted = submitted[sec.id] ?? false;

          return (
            <div key={sec.id} className="bg-white border border-primary/10 rounded-2xl shadow-sm overflow-hidden">

              {/* Section header */}
              <div
                onClick={() => toggleExpand(sec.id)}
                className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-primary/3 transition-colors border-b border-primary/8 group"
              >
                <div className="bg-secondary/10 p-2 rounded-xl shrink-0">
                  <BookOpen size={15} className="text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-primary text-sm">{sec.title}</h3>
                    {isSubmitted && (
                      <span className="text-[9px] font-black uppercase text-secondary bg-secondary/10 px-1.5 py-0.5 rounded border border-secondary/10 tracking-widest">
                        Submitted
                      </span>
                    )}
                  </div>
                  {sec.description && (
                    <p className="text-xs text-primary/40 truncate mt-0.5">{sec.description}</p>
                  )}
                </div>
                {isExpanded
                  ? <ChevronUp size={16} className="text-primary/40 shrink-0" />
                  : <ChevronDown size={16} className="text-primary/40 shrink-0" />
                }
              </div>

              {/* Expanded body */}
              {isExpanded && (
                <div className="p-5 space-y-6">

                  {/* Files grid */}
                  <div className="grid sm:grid-cols-2 gap-4">

                    {/* ── Homework (read-only) ── */}
                    <div>
                      <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-2.5">
                        Section Homework
                        {homeworkFiles.length > 0 && (
                          <span className="ml-2 text-secondary normal-case font-semibold">
                            ({homeworkFiles.length} file{homeworkFiles.length > 1 ? "s" : ""})
                          </span>
                        )}
                      </p>

                      <div className="space-y-2">
                        {homeworkFiles.length === 0 ? (
                          <div className="border border-dashed border-primary/15 rounded-xl px-4 py-3 text-center">
                            <p className="text-xs text-primary/30">No homework uploaded yet</p>
                          </div>
                        ) : (
                          homeworkFiles.map((img, idx) => (
                            <a
                              key={img.public_id || idx}
                              href={img.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 bg-secondary/5 border border-secondary/20 rounded-xl px-4 py-2.5 hover:bg-secondary/10 transition-colors group"
                            >
                              <div className="bg-secondary/10 p-1.5 rounded-lg shrink-0">
                                <FileText size={14} className="text-secondary" />
                              </div>
                              <p className="text-sm font-semibold text-primary flex-1 truncate hover:underline">
                                {img.url.split("/").pop()}
                              </p>
                            </a>
                          ))
                        )}
                      </div>
                    </div>

                    {/* ── Model Solution (read-only) ── */}
                    <div>
                      <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-2.5">
                        Model Solution
                        {solutionFiles.length > 0 && (
                          <span className="ml-2 text-secondary normal-case font-semibold">
                            ({solutionFiles.length} file{solutionFiles.length > 1 ? "s" : ""})
                          </span>
                        )}
                      </p>

                      <div className="space-y-2">
                        {solutionFiles.length === 0 ? (
                          <div className="border border-dashed border-primary/15 rounded-xl px-4 py-3 text-center">
                            <p className="text-xs text-primary/30">Not released yet</p>
                          </div>
                        ) : (
                          solutionFiles.map((img, idx) => (
                            <a
                              key={img.public_id || idx}
                              href={img.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 bg-secondary/5 border border-secondary/20 rounded-xl px-4 py-2.5 hover:bg-secondary/10 transition-colors"
                            >
                              <div className="bg-secondary/10 p-1.5 rounded-lg shrink-0">
                                <FileText size={14} className="text-secondary" />
                              </div>
                              <p className="text-sm font-semibold text-primary flex-1 truncate hover:underline">
                                {img.url.split("/").pop()}
                              </p>
                            </a>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ── Submit Paper ── */}
                  <div className="border-t border-primary/8 pt-5 space-y-3">
                    <p className="text-xs font-bold text-primary/40 uppercase tracking-widest">
                      Your Submission
                    </p>

                    {isSubmitted ? (
                      <div className="flex items-center gap-3 bg-secondary/5 border border-secondary/20 rounded-xl px-4 py-3">
                        <CheckCircle size={16} className="text-secondary shrink-0" />
                        <p className="text-sm font-semibold text-secondary">
                          Paper submitted successfully
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Selected files preview */}
                        {selectedFiles.length > 0 && (
                          <div className="space-y-2">
                            {selectedFiles.map((file, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3 bg-primary/3 border border-primary/10 rounded-xl px-4 py-2.5 group"
                              >
                                <div className="bg-primary/10 p-1.5 rounded-lg shrink-0">
                                  <FileText size={14} className="text-primary/50" />
                                </div>
                                <p className="text-sm font-semibold text-primary flex-1 truncate">{file.name}</p>
                                <button
                                  onClick={() => removeSelectedFile(sec.id, idx)}
                                  className="opacity-0 group-hover:opacity-100 text-primary/30 hover:text-red-500 transition-all p-1 rounded-lg hover:bg-red-50 shrink-0"
                                >
                                  <X size={13} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Upload + Submit row */}
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 border border-dashed border-primary/20 rounded-xl px-4 py-2.5 cursor-pointer hover:border-secondary/40 hover:bg-secondary/5 transition-all group flex-1">
                            <div className="bg-primary/5 group-hover:bg-secondary/10 p-1.5 rounded-lg transition-colors shrink-0">
                              <Upload size={14} className="text-primary/40 group-hover:text-secondary transition-colors" />
                            </div>
                            <span className="text-sm text-primary/50 group-hover:text-primary transition-colors">
                              {selectedFiles.length > 0
                                ? <>Add more · <span className="text-secondary font-semibold">Browse</span></>
                                : <>Attach paper · <span className="text-secondary font-semibold">Browse</span></>
                              }
                            </span>
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              multiple
                              className="hidden"
                              onChange={(e) => handleFileSelect(sec.id, e.target.files)}
                            />
                          </label>

                          <button
                            onClick={() => handleSubmit(sec.id)}
                            disabled={!selectedFiles.length}
                            className={`flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-xl transition-all
                              ${selectedFiles.length
                                ? "bg-secondary text-white shadow-md shadow-secondary/30 hover:opacity-90 hover:scale-[1.02]"
                                : "bg-primary/5 text-primary/30 cursor-not-allowed"
                              }`}
                          >
                            <CheckCircle size={14} />
                            Submit
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}