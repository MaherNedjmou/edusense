"use client";

import { useState, useEffect } from "react";
import {
  FileText, Upload, BookOpen, GraduationCap,
  Sparkles, Users, CheckCircle, X, ChevronDown, ChevronUp, Loader2, AlertCircle, Trash2
} from "lucide-react";
import api from "@/lib/api";

// ── Types ────────────────────────────────────────────────────────────────────
interface ImageFile {
  url: string;
  public_id: string;
  _id?: string;
}

interface Section {
  id: string;
  title: string;
  description: string;
  examImages: ImageFile[];
  solutionImages: ImageFile[];
}

interface ExistingAnswer {
  _id: string;
  examId: string;
  answers: ImageFile[];
  submittedAt: string;
  isGraded: boolean;
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
  const [sections, setSections] = useState<Section[]>([]);
  const [sectionsLoading, setSectionsLoading] = useState(true);

  // studentClassId is needed for submission
  const [studentClassId, setStudentClassId] = useState<string | null>(null);

  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  // Per-section submission state: { [sectionId]: File[] }
  const [submissions, setSubmissions] = useState<Record<string, File[]>>({});
  
  // Existing answers mapped by sectionId
  const [existingAnswers, setExistingAnswers] = useState<Record<string, ExistingAnswer>>({});

  // Per-section uploading state
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  // Per-section deleting state
  const [deleting, setDeleting] = useState<Record<string, boolean>>({});
  // Per-section submit error
  const [actionError, setActionError] = useState<Record<string, string>>({});

  // Fetch sections (exams)
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await api.get<any>(`/exams/class/${classId}`);
        const data: any[] = Array.isArray(res) ? res : (res.data ?? []);
        const mapped: Section[] = data.map((exam: any) => ({
          id: exam._id,
          title: exam.title,
          description: exam.description || "",
          examImages: exam.examImages || [],
          solutionImages: exam.solutionImages || [],
        }));
        setSections(mapped);
        if (mapped.length > 0) setExpandedIds([mapped[0].id]);
      } catch (err) {
        console.error("Failed to fetch exams:", err);
      } finally {
        setSectionsLoading(false);
      }
    };

    if (classId) fetchSections();
  }, [classId]);

  // Fetch this student's enrollment record
  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        const res = await api.get<any>(`/student-classes/my-enrollment/${classId}`);
        if (res.success && res.data?._id) {
          setStudentClassId(res.data._id);
        }
      } catch (err) {
        console.warn("Could not fetch enrollment record:", err);
      }
    };

    if (classId) fetchEnrollment();
  }, [classId]);

  // Fetch existing answers to populate existing submissions state
  const fetchExistingAnswers = async () => {
    try {
      const res = await api.get<any>(`/student-class-answers/my/${classId}`);
      if (res.success) {
        const answersMap: Record<string, ExistingAnswer> = {};
        res.data.forEach((ans: ExistingAnswer) => {
          answersMap[ans.examId] = ans;
        });
        setExistingAnswers(answersMap);
      }
    } catch (err) {
      console.error("Failed to fetch existing answers:", err);
    }
  };

  useEffect(() => {
    if (classId) fetchExistingAnswers();
  }, [classId]);


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

  const handleSubmit = async (sectionId: string) => {
    const files = submissions[sectionId];
    if (!files?.length) return;
    if (!studentClassId) {
      setActionError((prev) => ({ ...prev, [sectionId]: "Enrollment not found. Please re-open the class." }));
      return;
    }

    setUploading((prev) => ({ ...prev, [sectionId]: true }));
    setActionError((prev) => ({ ...prev, [sectionId]: "" }));

    try {
      const formData = new FormData();
      formData.append("examId", sectionId);
      formData.append("studentClassId", studentClassId);
      files.forEach((file) => formData.append("files", file));

      await api.upload("/student-class-answers/upload", formData);

      setSubmissions((prev) => ({ ...prev, [sectionId]: [] }));
      await fetchExistingAnswers(); // Refresh existing answers
    } catch (err: any) {
      setActionError((prev) => ({
        ...prev,
        [sectionId]: err.message || "Upload failed. Please try again.",
      }));
    } finally {
      setUploading((prev) => ({ ...prev, [sectionId]: false }));
    }
  };

  const handleDeleteAnswer = async (sectionId: string, answerId: string) => {
    if (!confirm("Are you sure you want to delete your submission? This cannot be undone.")) return;

    setDeleting((prev) => ({ ...prev, [sectionId]: true }));
    setActionError((prev) => ({ ...prev, [sectionId]: "" }));

    try {
      await api.delete(`/student-class-answers/my/${answerId}`);
      await fetchExistingAnswers(); // Refresh state
    } catch (err: any) {
      setActionError((prev) => ({
        ...prev,
        [sectionId]: err.message || "Deletion failed. Please try again.",
      }));
    } finally {
      setDeleting((prev) => ({ ...prev, [sectionId]: false }));
    }
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

        {/* Loading */}
        {sectionsLoading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 size={28} className="animate-spin text-primary/30" />
          </div>
        )}

        {/* Empty state */}
        {!sectionsLoading && sections.length === 0 && (
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
          const homeworkFiles = sec.examImages ?? [];
          const selectedFiles = submissions[sec.id] ?? [];
          const existingAnswer = existingAnswers[sec.id];
          const isSubmitted = !!existingAnswer;
          const isUploading = uploading[sec.id] ?? false;
          const isDeleting = deleting[sec.id] ?? false;
          const errorMsg = actionError[sec.id] ?? "";

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
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border tracking-widest ${
                        existingAnswer.isGraded
                          ? "text-accent bg-accent/10 border-accent/20"
                          : "text-secondary bg-secondary/10 border-secondary/20"
                      }`}>
                        {existingAnswer.isGraded ? "Graded" : "Submitted"}
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

                  {/* Homework files (read-only) */}
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
                        <div className="bg-red-50 border border-dashed border-red-200 rounded-xl px-4 py-3 flex text-center items-center justify-center gap-2">
                          <AlertCircle size={15} className="text-red-400" />
                          <p className="text-sm font-semibold text-red-500">No homework uploaded yet. You cannot submit.</p>
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

                  {/* Submit paper */}
                  {homeworkFiles.length > 0 && (
                    <div className="border-t border-primary/8 pt-5 space-y-3">
                      <p className="text-xs font-bold text-primary/40 uppercase tracking-widest">
                        Your Submission
                      </p>

                      {errorMsg && (
                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                          <AlertCircle size={14} className="shrink-0" />
                          {errorMsg}
                        </div>
                      )}

                      {isSubmitted ? (
                        <div className="space-y-3">
                          {/* List previously uploaded files */}
                          <div className="space-y-2">
                            {existingAnswer.answers.map((file, idx) => (
                              <a
                                key={file.public_id || idx}
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-primary/3 border border-primary/10 rounded-xl px-4 py-2.5 hover:bg-primary/5 transition-colors group"
                              >
                                <div className="bg-primary/10 p-1.5 rounded-lg shrink-0">
                                  <FileText size={14} className="text-primary/50" />
                                </div>
                                <p className="text-sm font-semibold text-primary flex-1 truncate hover:underline">
                                  {file.url.split("/").pop()}
                                </p>
                              </a>
                            ))}
                          </div>
                          
                          {/* State Actions: Locked vs Deletable */}
                          <div className="flex items-center justify-between border-t border-primary/10 pt-3">
                            <span className="text-xs font-medium text-primary/50">
                              Submitted {new Date(existingAnswer.submittedAt).toLocaleDateString()}
                            </span>

                            {existingAnswer.isGraded ? (
                              <span className="text-sm font-semibold text-accent flex items-center gap-1.5 bg-accent/10 px-3 py-1.5 rounded-lg">
                                <CheckCircle size={15} /> Evaluated. Cannot be changed.
                              </span>
                            ) : (
                              <button
                                onClick={() => handleDeleteAnswer(sec.id, existingAnswer._id)}
                                disabled={isDeleting}
                                className="flex items-center gap-2 text-xs font-bold px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
                              >
                                {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                {isDeleting ? "Deleting..." : "Delete & Resubmit"}
                              </button>
                            )}
                          </div>
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
                                  ? <><>Add more · </><span className="text-secondary font-semibold">Browse</span></>
                                  : <><>Attach paper · </><span className="text-secondary font-semibold">Browse</span></>
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
                              disabled={!selectedFiles.length || isUploading}
                              className={`flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-xl transition-all
                                ${selectedFiles.length && !isUploading
                                  ? "bg-secondary text-white shadow-md shadow-secondary/30 hover:opacity-90 hover:scale-[1.02]"
                                  : "bg-primary/5 text-primary/30 cursor-not-allowed"
                                }`}
                            >
                              {isUploading
                                ? <Loader2 size={14} className="animate-spin" />
                                : <CheckCircle size={14} />
                              }
                              {isUploading ? "Uploading…" : "Submit"}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}