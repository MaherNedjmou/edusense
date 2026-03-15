
"use client";

import { useState, useEffect } from "react";
import {
  Plus, Upload, FileText, Brain, X,
  Clipboard, Users, BookOpen,
  CheckCircle, GraduationCap, Sparkles, Crown, AlertTriangle,
} from "lucide-react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Button from "@/components/UI/Button";
import { CLASS_SECTIONS_DATA } from "@/data/mockData";
import api from "@/lib/api";


interface Section {
  id: any;
  title: string;
  description: string;
  classId: string;
  examImages?: { url: string; public_id: string }[];
  solutionImages?: { url: string; public_id: string }[];
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
  const [expandedIds, setExpandedIds] = useState<any[]>([]);

  const [showAddSection, setShowAddSection] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionDesc, setSectionDesc] = useState("");
  const [copied, setCopied] = useState(false);

  const [analyzedSections, setAnalyzedSections] = useState<any[]>([]);
  const [isBulkAnalyzing, setIsBulkAnalyzing] = useState<any | null>(null);

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

  const removeSection = (id: any) =>
    setSections((prev) => prev.filter((s) => s.id !== id));

  const toggleExpand = (id: any) =>
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  /** Append multiple files to examImages or solutionImages after uploading to Cloudinary */
  const handleUpload = async (id: any, files: FileList | null, type: "exam" | "solution") => {
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
  const removeFile = async (sectionId: any, public_id: string, type: "exam" | "solution") => {
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

  const startBulkAnalysis = (id: any) => {
    const sec = sections.find((s) => s.id === id);
    if (!sec?.solutionImages?.length) return;
    setIsBulkAnalyzing(id);
    setTimeout(() => {
      setIsBulkAnalyzing(null);
      setAnalyzedSections((prev) => [...prev, id]);
    }, 2500);
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
                            <p className="text-[10px] text-primary/40 font-bold uppercase tracking-tight">AI Generated Insights for {cls.studentCount} Students</p>
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

                  <div className="border border-dashed border-primary/15 rounded-xl p-4 text-center">
                    <p className="text-xs text-primary/40">{isAnalyzed ? "All student papers analyzed" : "No student submissions yet"}</p>
                  </div>

                  {/* Files grid */}
                  <div className="grid sm:grid-cols-2 gap-4">

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

                  <div className="flex items-center gap-3 pt-2 border-t border-primary/8">
                    <Button
                      onClick={() => startBulkAnalysis(sec.id)}
                      disabled={!modelFiles.length || isCurrentAnalyzing || isAnalyzed}
                      className={`flex items-center gap-2 bg-secondary text-xs font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all shadow-md shadow-secondary/30 ${(!modelFiles.length || isCurrentAnalyzing || isAnalyzed) ? "opacity-40 cursor-not-allowed grayscale" : "hover:scale-[1.02]"}`}
                    >
                      {isCurrentAnalyzing ? (
                        <><Brain size={16} className="animate-spin" /> Analyzing Class...</>
                      ) : isAnalyzed ? (
                        <><CheckCircle size={16} /> Analysis Ready</>
                      ) : (
                        <><Brain size={16} /> Analyze Whole Class</>
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