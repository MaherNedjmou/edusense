"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { 
  Upload, FileText, Brain, Sparkles, Crown, X, 
  CheckCircle, Lightbulb, AlertTriangle, ChevronDown, 
  GraduationCap, Plus, Download, RotateCcw, Loader2
} from "lucide-react";
import Button from "@/components/UI/Button";
import InsightCard from "@/components/UI/InsightCard";
import api from "@/lib/api";

export default function AnalysisPage() {
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [studentPapers, setStudentPapers] = useState<File[]>([]);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Analysis flow states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [feedbackData, setFeedbackData] = useState<any>(null);
  const [analysisId, setAnalysisId] = useState<string>(""); // StudentClassAnswer _id
  const [isUploadingSolution, setIsUploadingSolution] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Data states
  const [classes, setClasses] = useState<any[]>([]);
  const [allSections, setAllSections] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  // Fetch initial classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get<any>("/classes");
        if (res && res.data) setClasses(res.data);
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };
    fetchClasses();
  }, []);

  // Fetch sections and students when class changes
  useEffect(() => {
    if (!selectedClassId) {
      setAllSections([]);
      setStudents([]);
      return;
    }
    const fetchClassData = async () => {
      try {
        const [examsRes, studentsRes] = await Promise.all([
          api.get<any>(`/exams/class/${selectedClassId}`),
          api.get<any>(`/student-classes/${selectedClassId}`)
        ]);
        if (examsRes) setAllSections(examsRes);
        if (studentsRes) {
          setStudents(studentsRes.map((sc: any) => ({
            id: sc._id,
            name: sc.student?.user?.firstName
              ? `${sc.student.user.firstName} ${sc.student.user.lastName}`
              : (sc.student?.name || "Unknown")
          })));
        }
      } catch (err) {
        console.error("Error fetching class data:", err);
      }
    };
    fetchClassData();
  }, [selectedClassId]);

  const sections = allSections;

  const selectedSection = useMemo(() => {
    return sections.find((s: any) => s._id === selectedSectionId || s.id === selectedSectionId);
  }, [sections, selectedSectionId]);

  const selectedStudentName = useMemo(() => {
    return students.find(s => s.id === selectedStudent)?.name || selectedStudent;
  }, [students, selectedStudent]);

  const handleStudentUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    if (studentPapers.length + newFiles.length > 5) {
      setShowUpgrade(true);
      return;
    }
    setStudentPapers((prev) => [...prev, ...newFiles]);
  };

  const handleStudentDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    handleStudentUpload(e.dataTransfer.files);
  };

  const removeStudentFile = (index: number) =>
    setStudentPapers(studentPapers.filter((_, i) => i !== index));

  const handleModelSolutionUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length || !selectedSectionId) return;
    setIsUploadingSolution(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => formData.append("files", file));
      const uploadRes = await api.upload<any>("/cloudinary/upload", formData);
      if (!uploadRes.results) return;
      const newImages = uploadRes.results.map((r: any) => ({ url: r.cloudinaryUrl, public_id: r.public_id }));
      const currentSection = allSections.find(s => s._id === selectedSectionId || s.id === selectedSectionId);
      const payload = { solutionImages: [...(currentSection?.solutionImages ?? []), ...newImages] };
      const updatedExam = await api.put<any>(`/exams/${selectedSectionId}`, payload);
      setAllSections(prev => prev.map(s => {
        if (s._id === selectedSectionId || s.id === selectedSectionId) {
          return { ...s, solutionImages: updatedExam.solutionImages };
        }
        return s;
      }));
    } catch (err) {
      console.error("Failed to upload model solution", err);
    } finally {
      setIsUploadingSolution(false);
    }
  };

  const startAnalysis = async () => {
    if (!isReadyForAnalysis) return;
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      studentPapers.forEach(file => formData.append("files", file));
      formData.append("examId", selectedSectionId.toString());
      formData.append("studentClassId", selectedStudent);

      const res = await api.upload<any>("/student-class-answers/upload", formData);
      const answerId = res._id || res.id;
      setAnalysisId(answerId);

      const feedbackRes = await api.post<any>("/feedbacks/generate", {
        studentClassAnswerId: answerId
      });

      setFeedbackData(feedbackRes);
      setAnalysisComplete(true);
      setScore(feedbackRes.rating || 0);
    } catch (err) {
      console.error("Analysis upload failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!analysisId) return;
    setIsDownloading(true);
    try {
      const examTitle = selectedSection?.title || "exam";
      const filename = `report_${examTitle.replace(/\s+/g, "_")}_${selectedStudentName.replace(/\s+/g, "_")}.pdf`;
      await api.downloadPdf(`/reports/exam/${analysisId}`, filename);
    } catch (err) {
      console.error("Failed to download report:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysisComplete(false);
    setStudentPapers([]);
    setFeedbackData(null);
    setAnalysisId("");
    setScore(0);
  };

  const isReadyForAnalysis = selectedClassId && selectedSectionId && selectedStudent && studentPapers.length > 0;

  return (
    <div className="p-8 bg-background text-primary min-h-screen space-y-8 relative">

      {/* Loading Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-100 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-secondary/20 rounded-full animate-ping"></div>
            <div className="bg-secondary p-8 rounded-full shadow-2xl relative">
              <Brain size={48} className="text-white animate-pulse" />
            </div>
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-primary">AI is Analyzing...</h2>
            <p className="text-primary/40 font-bold uppercase tracking-widest text-xs">
              Scanning {studentPapers[0]?.name} against model solution
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Paper Analysis</h1>
          <p className="text-primary/50 text-sm">Select a context and upload a student paper to generate AI insights.</p>
        </div>
      </div>

      {/* Selection Context */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Class */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest px-1">Class</label>
          <div className="relative">
            <select
              disabled={analysisComplete}
              value={selectedClassId}
              onChange={(e) => { setSelectedClassId(e.target.value); setSelectedSectionId(""); }}
              className="w-full bg-white border border-primary/10 rounded-xl px-4 py-3 text-sm font-bold text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 appearance-none cursor-pointer disabled:opacity-50"
            >
              <option value="">Select a class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>{cls.name}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/30 pointer-events-none" />
          </div>
        </div>

        {/* Section */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest px-1">Section</label>
          <div className="relative">
            <select
              disabled={!selectedClassId || analysisComplete}
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="w-full bg-white border border-primary/10 rounded-xl px-4 py-3 text-sm font-bold text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select a section</option>
              {sections.map((sec) => (
                <option key={sec._id || sec.id} value={sec._id || sec.id}>{sec.title}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/30 pointer-events-none" />
          </div>
        </div>

        {/* Student */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest px-1">Student</label>
          <div className="relative">
            <select
              disabled={!selectedSectionId || analysisComplete}
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full bg-white border border-primary/10 rounded-xl px-4 py-3 text-sm font-bold text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select a student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/30 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* Left: Model Solution */}
        <div className="space-y-6 min-h-40">
          <div className="bg-white border border-primary/10 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="bg-primary/5 p-2.5 rounded-2xl">
                <FileText size={20} className="text-primary/60" />
              </div>
              <h3 className="font-bold text-primary">Model Solution</h3>
            </div>

            {selectedSection ? (
              <div className="space-y-4">
                {selectedSection.solutionImages && selectedSection.solutionImages.length > 0 ? (
                  <div className="flex items-center gap-3 bg-secondary/5 border border-secondary/20 rounded-2xl px-4 py-3">
                    <div className="bg-secondary/10 p-2 rounded-xl shrink-0">
                      <CheckCircle size={18} className="text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-primary truncate">Section Images Attached</p>
                      <p className="text-[10px] text-primary/40 uppercase font-bold tracking-tight">
                        {selectedSection.solutionImages.length} images as reference
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border-2 border-dashed border-primary/10 rounded-2xl text-center space-y-3">
                    <div className="flex justify-center">
                      <AlertTriangle size={24} className="text-amber-500/60" />
                    </div>
                    <p className="text-xs text-primary/60 font-medium">No model solution found for this section.</p>
                    {isUploadingSolution ? (
                      <p className="inline-block text-[10px] text-primary/40 font-bold py-1.5 px-3">Uploading...</p>
                    ) : (
                      <label className="inline-block cursor-pointer">
                        <div className="bg-white border border-primary/20 hover:border-secondary/40 hover:bg-secondary/5 text-primary text-[10px] py-1.5 px-3 rounded-lg font-bold transition-all">
                          Upload One Now
                        </div>
                        <input type="file" accept=".pdf,.png,.jpg,.jpeg" multiple className="hidden" onChange={handleModelSolutionUpload} />
                      </label>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-10 text-center">
                <p className="text-xs text-primary/30 font-bold italic">Select a section to view its reference answer key</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Upload or Result */}
        <div className="space-y-6 min-h-40">
          {!analysisComplete ? (
            <div className="bg-white border border-primary/10 rounded-3xl p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-secondary/10 p-3 rounded-2xl">
                    <GraduationCap size={24} className="text-secondary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-primary">Student Paper</h2>
                    <p className="text-sm text-primary/40 font-medium">Answer sheet upload</p>
                  </div>
                </div>
                {studentPapers.length > 0 && (
                  <span className="text-[10px] font-black bg-secondary/10 text-secondary px-3 py-1.5 rounded-full uppercase tracking-widest border border-secondary/10">
                    {studentPapers.length} File Added
                  </span>
                )}
              </div>

              <label
                onDrop={handleStudentDrop}
                onDragOver={(e) => e.preventDefault()}
                className="flex flex-col items-center justify-center border-2 border-dashed border-primary/10 rounded-3xl p-5 cursor-pointer hover:border-secondary/40 hover:bg-secondary/5 transition-all group relative overflow-hidden"
              >
                {studentPapers.length === 0 ? (
                  <>
                    <div className="bg-primary/5 group-hover:bg-secondary/10 p-6 rounded-3xl mb-4 transition-colors">
                      <Upload size={32} className="text-primary/40 group-hover:text-secondary transition-colors" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-lg font-bold text-primary group-hover:text-secondary transition-colors">
                        Drop file here or <span className="text-secondary">browse</span>
                      </p>
                      <p className="text-sm text-primary/30 font-medium">Supports PDF, PNG, JPG (Max 10MB)</p>
                    </div>
                  </>
                ) : (
                  <div className="w-full">
                    <div className="flex items-center justify-between px-2 mb-2">
                      <span className="text-xs font-bold text-primary/70">{studentPapers.length} file(s) attached</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                        className="inline-flex items-center gap-1 text-primary/70 hover:text-secondary text-sm font-bold"
                      >
                        <Plus size={14} /> Add another
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                      {studentPapers.map((file, index) => (
                        <div key={index} className="flex items-center gap-3 bg-primary/2 border border-primary/5 rounded-2xl p-2 relative group hover:bg-white hover:shadow-md transition-all">
                          <div className="bg-secondary/10 p-2 rounded-xl shrink-0">
                            <FileText size={16} className="text-secondary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-primary truncate">{file.name}</p>
                            <p className="text-[10px] text-primary/40">{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                          <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeStudentFile(index); }}
                            className="absolute -top-2 -right-2 bg-white text-primary border border-primary/10 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50 hover:text-red-500"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <input type="file" ref={fileInputRef} multiple accept=".pdf,.png,.jpg,.jpeg" className="hidden"
                  onChange={(e) => handleStudentUpload(e.target.files)} />
              </label>

              {showUpgrade && (
                <div className="bg-accent/5 border border-accent/20 rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Crown size={20} className="text-accent shrink-0" />
                    <p className="text-xs font-bold text-primary/70">Bulk analysis and multi-file processing is restricted on Free plan.</p>
                  </div>
                  <Button variant="primary" className="text-[10px] h-auto py-2 px-4 shadow-lg shadow-accent/20 bg-accent border-none">
                    Upgrade to Pro
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* ─── Analysis Result View ─── */
            <div className="bg-white border-2 border-secondary/20 rounded-3xl p-8 shadow-2xl space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-secondary p-3 rounded-2xl shadow-lg shadow-secondary/30">
                    <Sparkles size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-primary">Performance Result</h2>
                    <p className="text-sm text-primary/40 font-bold uppercase tracking-widest">
                      {selectedStudentName} · {selectedSection?.title}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-primary/30 uppercase tracking-[0.2em] mb-1">Final Score</p>
                  <div className="text-4xl font-black text-secondary">{score}%</div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-green-50/50 border border-green-100 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-green-700 font-black text-xs uppercase tracking-widest">
                    <CheckCircle size={14} /> Key Strengths
                  </div>
                  <ul className="text-xs text-primary/70 space-y-2 list-disc pl-4 font-medium">
                    <li>{feedbackData?.strengths || "Excellent application of concepts."}</li>
                  </ul>
                </div>
                <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-amber-700 font-black text-xs uppercase tracking-widest">
                    <AlertTriangle size={14} /> Focus Areas
                  </div>
                  <ul className="text-xs text-primary/70 space-y-2 list-disc pl-4 font-medium">
                    <li>{feedbackData?.weaknesses || "Observation areas noted during analysis."}</li>
                  </ul>
                </div>
              </div>

              <div className="bg-primary/2 border border-primary/5 rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest">
                  <Lightbulb size={14} className="text-secondary" /> AI Teacher's Note
                </div>
                <p className="text-sm text-primary/70 leading-relaxed font-medium">
                  "{feedbackData?.recommendation || "Student shows high mastery of the subject."}"
                </p>
              </div>

              {/* ─── Download / Discard ─── */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={handleDownloadReport}
                  disabled={isDownloading || !analysisId}
                  className="flex-1 flex items-center justify-center gap-2 bg-secondary text-white font-bold text-sm py-3 px-6 rounded-2xl shadow-lg shadow-secondary/30 hover:bg-secondary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {isDownloading
                    ? <><Loader2 size={18} className="animate-spin" /> Generating PDF...</>
                    : <><Download size={18} /> Download Report</>
                  }
                </button>
                <button
                  onClick={resetAnalysis}
                  className="flex items-center justify-center gap-2 border border-primary/15 text-primary/60 font-bold text-sm py-3 px-6 rounded-2xl hover:bg-primary/5 transition-all"
                >
                  <RotateCcw size={16} /> Discard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Generate Button (pre-analysis) */}
      {!analysisComplete && (
        <div className="flex justify-center mt-6">
          <Button
            variant="primary"
            onClick={startAnalysis}
            disabled={!isReadyForAnalysis}
            className="max-w-md w-full py-4 rounded-2xl"
          >
            <Sparkles size={20} />
            Generate AI Insights
          </Button>
        </div>
      )}

      {/* AI Insights Section */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary/30">AI Performance Insights</h2>
          <div className="h-px flex-1 bg-primary/10 ml-6"></div>
        </div>
        <div className="grid lg:grid-cols-3 gap-5 text-sm">
          <InsightCard
            variant="success"
            icon={<CheckCircle size={18} />}
            title="Key Strengths"
            text={analysisComplete && feedbackData ? feedbackData.strengths : "Initial scans will appear here. Select context and student to begin."}
          />
          <InsightCard
            variant="warning"
            icon={<AlertTriangle size={18} />}
            title="Common Weaknesses"
            text={analysisComplete && feedbackData ? feedbackData.weaknesses : "AI will identify patterns across multiple papers for this section."}
          />
          <InsightCard
            variant="info"
            icon={<Lightbulb size={18} />}
            title="AI Recommendation"
            text={analysisComplete && feedbackData ? feedbackData.recommendation : "Tailored feedback will be generated based on the model solution."}
          />
        </div>
      </div>

    </div>
  );
}