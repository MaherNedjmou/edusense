"use client";

import { useState, useEffect } from "react";
import {
  Plus, Upload, FileText, Brain, X,
  Clipboard, Users, BookOpen,
  CheckCircle, GraduationCap, Sparkles, Crown, AlertTriangle, User
} from "lucide-react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Button from "@/components/UI/Button";
import api from "@/lib/api";


interface ImageFile {
  url: string;
  public_id: string;
}

interface Section {
  id: string;
  title: string;
  description: string;
  classId: string;
  examImages?: ImageFile[];
  solutionImages?: ImageFile[];
}

interface StudentAnswer {
  _id: string;
  examId: string;
  answers: ImageFile[];
  submittedAt: string;
  isGraded: boolean;
  student: {
    name: string;
    email: string;
    avatar: string;
  };
}

interface StreamTabProps {
  cls: {
    id: string;
    name: string;
    description: string;
    code: string;
    studentCount: number;
    _id: string;
  };
  classId: string;
}

export default function StreamTab({ cls, classId }: StreamTabProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  
  // All student answers for this class
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswer[]>([]);

  const [showAddSection, setShowAddSection] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionDesc, setSectionDesc] = useState("");
  const [copied, setCopied] = useState(false);

  const [analyzedSections, setAnalyzedSections] = useState<string[]>([]);
  const [isBulkAnalyzing, setIsBulkAnalyzing] = useState<string | null>(null);

  const copyCode = () => {
    navigator.clipboard.writeText(cls._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const addSection = async () => {
    if (!sectionTitle.trim() || !cls._id) return;

    setSectionTitle("");
    setSectionDesc("");
    setShowAddSection(false);

    try {
      const res = await api.post<any>("/exams", {
        title: sectionTitle,
        description: sectionDesc,
        class: cls._id,
      });

      if (!res) return;

      const addNewSection: Section = {
        id: res._id,
        title: res.title,
        description: res.description,
        classId: res.class,
        examImages: [],
        solutionImages: [],
      };

      setSections((prev) => [...prev, addNewSection]);
      setExpandedIds((prev) => [...prev, res._id]);
    } catch (err) {
      console.log(err);
    }
  };

  const removeSection = (id: string) =>
    setSections((prev) => prev.filter((s) => s.id !== id));

  const toggleExpand = (id: string) =>
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  /** Append multiple files to examImages or solutionImages after uploading to Cloudinary */
  const handleUpload = async (id: string, files: FileList | null, type: "exam" | "solution") => {
    if (!files?.length) return;

    const formData = new FormData();
    Array.from(files).forEach(file => formData.append("files", file));

    try {
      // 1. Upload to Cloudinary via our testing/utility endpoint
      const uploadRes = await api.upload<any>("/cloudinary/upload", formData);
      if (!uploadRes.results) return;

      const newImages = uploadRes.results.map((r: any) => ({
        url: r.cloudinaryUrl,
        public_id: r.public_id
      }));

      // 2. Fetch current exam to get existing images
      const currentSection = sections.find(s => s.id === id);
      if (!currentSection) return;

      const updatedPayload: any = {};
      if (type === "solution") {
        updatedPayload.solutionImages = [...(currentSection.solutionImages ?? []), ...newImages];
      } else {
        updatedPayload.examImages = [...(currentSection.examImages ?? []), ...newImages];
      }

      // 3. Update backend Exam record
      const updatedExam = await api.put<any>(`/exams/${id}`, updatedPayload);

      // 4. Update local state
      setSections(prev => prev.map(s => s.id === id ? {
        ...s,
        examImages: updatedExam.examImages,
        solutionImages: updatedExam.solutionImages
      } : s));

    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  /** Remove a single file by public_id */
  const removeFile = async (sectionId: string, public_id: string, type: "exam" | "solution") => {
    try {
      // 1. Delete from Cloudinary and DB
      const endpoint = type === "solution" ? "solution-image" : "exam-image";
      const updatedExam = await api.delete<any>(`/exams/${sectionId}/${endpoint}?public_id=${public_id}`);

      // 2. Update local state
      setSections(prev => prev.map(s => s.id === sectionId ? {
        ...s,
        examImages: updatedExam.examImages,
        solutionImages: updatedExam.solutionImages
      } : s));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const startBulkAnalysis = async (id: string) => {
    const sec = sections.find((s) => s.id === id);
    if (!sec?.solutionImages?.length) return;

    // Get all ungraded submissions for this section
    const sectionAnswers = studentAnswers.filter(a => a.examId === id && !a.isGraded);
    if (!sectionAnswers.length) return;

    const submissionIds = sectionAnswers.map(a => a._id);

    setIsBulkAnalyzing(id);
    
    try {
      await api.post("/feedbacks/bulk-analyze", { submissionIds });
      
      setAnalyzedSections((prev) => [...prev, id]);
      // Locally mark them as graded so they disappear
      setStudentAnswers((prev) => prev.map(a => a.examId === id ? { ...a, isGraded: true } : a));
    } catch (err) {
      console.error("Failed to bulk analyze:", err);
    } finally {
      setIsBulkAnalyzing(null);
    }
  };

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await api.get<any>(`/exams/class/${cls._id}`);
        if (!res) return;

        if (Array.isArray(res)) {
          const mapped = res.map((item: any) => ({
            id: item._id,
            title: item.title,
            description: item.description,
            classId: item.class,
            examImages: item.examImages ?? [],
            solutionImages: item.solutionImages ?? [],
          }));
          setSections(mapped);
          mapped.forEach((item: any) => {
            setExpandedIds((prev) => [...prev, item.id]);
          });
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchExams();
  }, [cls._id]);

  useEffect(() => {
    const fetchStudentAnswers = async () => {
      try {
        const res = await api.get<any>(`/student-class-answers/teacher/${cls._id}`);
        if (res.success && res.data) {
          setStudentAnswers(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch student answers", err);
      }
    };
    fetchStudentAnswers();
  }, [cls._id]);

  // Aggregate un-graded submissions for the notification banner
  const ungroupedUnGraded = studentAnswers.filter(a => !a.isGraded).length;

  return (
    <div className="grid lg:grid-cols-4 gap-6">

      {/* Sidebar */}
      <div className="space-y-4">
        <div className="bg-white border border-primary/10 rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-3">Class Code</p>
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-xl text-primary">{cls._id.slice(0, 7)}...</span>
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

        {/* Global Notifications for new submissions */}
        {ungroupedUnGraded > 0 && (
          <div className="bg-secondary/10 border-l-4 border-secondary p-4 rounded-xl flex items-start gap-3">
            <AlertTriangle className="text-secondary shrink-0 mt-0.5" size={18} />
            <div>
              <h4 className="text-sm font-bold text-primary">Submissions Ahead!</h4>
              <p className="text-xs text-primary/70 mt-1">
                You have {ungroupedUnGraded} un-analyzed student paper{ungroupedUnGraded === 1 ? "" : "s"} across all sections waiting for AI analysis.
              </p>
            </div>
          </div>
        )}

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
          const isAnalyzed = analyzedSections.includes(sec.id);
          const isCurrentAnalyzing = isBulkAnalyzing === sec.id;
          const modelFiles = sec.solutionImages ?? [];
          const homeworkFiles = sec.examImages ?? [];

          // Filter student submissions intended for this specific exam section
          const sectionAnswers = studentAnswers.filter(a => a.examId === sec.id && !a.isGraded);
          const unGradedAnswersCount = sectionAnswers.length;

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
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-primary text-sm">{sec.title}</h3>
                    {isAnalyzed && (
                      <span className="text-[9px] font-black uppercase text-secondary bg-secondary/10 px-1.5 py-0.5 rounded border border-secondary/10 tracking-widest">
                        Analyzed
                      </span>
                    )}
                    {unGradedAnswersCount > 0 && !isAnalyzed && (
                      <span className="text-[9px] font-black uppercase text-accent bg-accent/10 px-1.5 py-0.5 rounded border border-accent/20 tracking-widest">
                        {unGradedAnswersCount} New Submissions 
                      </span>
                    )}
                  </div>
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
                <div className="p-5 space-y-6">

                  {/* Bulk Analysis Result */}
                  {isAnalyzed && (
                    <div className="bg-secondary/5 border-2 border-secondary/20 rounded-2xl p-5 space-y-4 animate-in slide-in-from-top-4 duration-500">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-secondary p-2 rounded-xl text-white">
                            <Brain size={18} />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-primary">Class Performance Summary</h4>
                            <p className="text-[10px] text-primary/40 font-bold uppercase tracking-tight">AI Generated Insights for {sectionAnswers.length} Submissions</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest">Class Avg</p>
                          <p className="text-xl font-black text-secondary">84.2%</p>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-white/60 p-4 rounded-xl border border-secondary/10 space-y-2">
                          <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest flex items-center gap-2">
                            <Sparkles size={12} /> Key Strengths
                          </p>
                          <p className="text-xs text-primary/70 font-medium">Strong conceptual grasp of vector addition and Newton's baseline laws.</p>
                        </div>
                        <div className="bg-white/60 p-4 rounded-xl border border-secondary/10 space-y-2">
                          <p className="text-[10px] font-black text-amber-600/60 uppercase tracking-widest flex items-center gap-2">
                            <AlertTriangle size={12} /> Common Challenges
                          </p>
                          <p className="text-xs text-primary/70 font-medium">Struggled with multi-step friction problems. 40% Students skipped final units.</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <Button className="flex-1 text-[10px] font-bold py-2 bg-secondary text-white rounded-xl shadow-lg shadow-secondary/20">Sync Grades to SIS</Button>
                        <Button variant="outline" className="flex-1 text-[10px] font-bold py-2 rounded-xl">Detailed Class Report</Button>
                      </div>
                    </div>
                  )}

                  {/* Files grid */}
                  <div className="grid sm:grid-cols-2 gap-6">

                    {/* ── Model Solution ── */}
                    <div>
                      <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-2.5">
                        Model Solution
                        {modelFiles.length > 0 && (
                          <span className="ml-2 text-secondary normal-case font-semibold">
                            ({modelFiles.length} file{modelFiles.length > 1 ? "s" : ""})
                          </span>
                        )}
                      </p>

                      <div className="space-y-2">
                        {/* Existing files */}
                        {modelFiles.map((img, idx) => (
                          <div
                            key={img.public_id || idx}
                            className="flex items-center gap-3 bg-secondary/5 border border-secondary/20 rounded-xl px-4 py-2.5 group"
                          >
                            <div className="bg-secondary/10 p-1.5 rounded-lg shrink-0">
                              <FileText size={14} className="text-secondary" />
                            </div>
                            <p className="text-sm font-semibold text-primary flex-1 truncate">
                              <a href={img.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                {img.url.split("/").pop()}
                              </a>
                            </p>
                            <button
                              onClick={() => removeFile(sec.id, img.public_id, "solution")}
                              className="opacity-0 group-hover:opacity-100 text-primary/30 hover:text-red-500 transition-all p-1 rounded-lg hover:bg-red-50 shrink-0"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ))}

                        {/* Upload more / first upload */}
                        <label className="flex items-center gap-3 border border-dashed border-primary/20 rounded-xl px-4 py-3 cursor-pointer hover:border-secondary/40 hover:bg-secondary/5 transition-all group">
                          <div className="bg-primary/5 group-hover:bg-secondary/10 p-2 rounded-lg transition-colors shrink-0">
                            <Upload size={15} className="text-primary/40 group-hover:text-secondary transition-colors" />
                          </div>
                          <span className="text-sm text-primary/50 group-hover:text-primary transition-colors">
                            {modelFiles.length > 0
                              ? <>Add more · <span className="text-secondary font-semibold">Browse</span></>
                              : <>Upload model solution · <span className="text-secondary font-semibold">Browse</span></>
                            }
                          </span>
                          <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            multiple
                            className="hidden"
                            onChange={(e) => handleUpload(sec.id, e.target.files, "solution")}
                          />
                        </label>
                      </div>
                    </div>

                    {/* ── Section Homework ── */}
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
                        {/* Existing files */}
                        {homeworkFiles.map((img, idx) => (
                          <div
                            key={img.public_id || idx}
                            className="flex items-center gap-3 bg-secondary/5 border border-secondary/20 rounded-xl px-4 py-2.5 group"
                          >
                            <div className="bg-secondary/10 p-1.5 rounded-lg shrink-0">
                              <FileText size={14} className="text-secondary" />
                            </div>
                            <p className="text-sm font-semibold text-primary flex-1 truncate">
                              <a href={img.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                {img.url.split("/").pop()}
                              </a>
                            </p>
                            <button
                              onClick={() => removeFile(sec.id, img.public_id, "exam")}
                              className="opacity-0 group-hover:opacity-100 text-primary/30 hover:text-red-500 transition-all p-1 rounded-lg hover:bg-red-50 shrink-0"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ))}

                        {/* Upload more / first upload */}
                        <label className="flex items-center gap-3 border border-dashed border-primary/20 rounded-xl px-4 py-3 cursor-pointer hover:border-secondary/40 hover:bg-secondary/5 transition-all group">
                          <div className="bg-primary/5 group-hover:bg-secondary/10 p-2 rounded-lg transition-colors shrink-0">
                            <Upload size={15} className="text-primary/40 group-hover:text-secondary transition-colors" />
                          </div>
                          <span className="text-sm text-primary/50 group-hover:text-primary transition-colors">
                            {homeworkFiles.length > 0
                              ? <>Add more · <span className="text-secondary font-semibold">Browse</span></>
                              : <>Upload homework · <span className="text-secondary font-semibold">Browse</span></>
                            }
                          </span>
                          <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            multiple
                            className="hidden"
                            onChange={(e) => handleUpload(sec.id, e.target.files, "exam")}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* ── Student Submissions Feed ── */}
                  {sectionAnswers.length > 0 && (
                    <div className="border-t border-primary/10 pt-5 space-y-4">
                      <p className="text-xs font-bold text-primary/40 uppercase tracking-widest">
                        Student Submissions
                      </p>
                      
                      <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                        {sectionAnswers.map(ans => (
                          <div key={ans._id} className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-secondary/20 border-2 border-white flex items-center justify-center text-sm font-bold text-secondary">
                                {ans.student.avatar}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-primary">{ans.student.name || "Unknown Student"}</p>
                                <p className="text-xs text-primary/50">
                                  {ans.answers.length} file{ans.answers.length === 1 ? "" : "s"} attached · {new Date(ans.submittedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div>
                              {ans.isGraded ? (
                                <span className="text-[10px] font-bold uppercase tracking-widest text-secondary bg-secondary/10 border border-secondary/20 px-2 py-1 rounded-lg">
                                  Evaluated
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold uppercase tracking-widest text-accent bg-accent/10 border border-accent/20 px-2 py-1 rounded-lg">
                                  Pending AI Review
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-5 border-t border-primary/8">
                    <Button
                      onClick={() => startBulkAnalysis(sec.id)}
                      disabled={!modelFiles.length || isCurrentAnalyzing || isAnalyzed || sectionAnswers.length === 0}
                      className={`flex items-center gap-2 bg-secondary text-xs font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all shadow-md shadow-secondary/30 ${(!modelFiles.length || isCurrentAnalyzing || isAnalyzed || sectionAnswers.length === 0) ? "opacity-40 cursor-not-allowed grayscale" : "hover:scale-[1.02]"}`}
                    >
                      {isCurrentAnalyzing ? (
                        <><Brain size={16} className="animate-spin" /> Analyzing Class...</>
                      ) : isAnalyzed ? (
                        <><CheckCircle size={16} /> Analysis Ready</>
                      ) : (
                        <><Brain size={16} /> Analyze {sectionAnswers.length} Submission{sectionAnswers.length === 1 ? "" : "s"}</>
                      )}
                    </Button>
                    {!isAnalyzed && (
                      <div className="flex items-center gap-2 border border-accent/30 bg-accent/5 rounded-xl px-3 py-2">
                        <Crown size={13} className="text-accent" />
                        <span className="text-xs font-semibold text-primary/60">
                          Bulk on <span className="text-accent font-bold">Pro</span>
                        </span>
                      </div>
                    )}
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