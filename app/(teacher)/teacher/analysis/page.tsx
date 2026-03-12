"use client";

import { useState } from "react";
import { Upload, FileText, Brain, Sparkles, Crown, X, CheckCircle, Lightbulb, AlertTriangle } from "lucide-react";
import Button from "@/components/UI/Button";
import InsightCard from "@/components/UI/InsightCard";

export default function AnalysisPage() {
  const [modelSolution, setModelSolution] = useState<File | null>(null);
  const [studentPapers, setStudentPapers] = useState<File[]>([]);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleStudentUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    if (studentPapers.length + newFiles.length > 1) {
      setShowUpgrade(true);
      return;
    }
    setStudentPapers((prev) => [...prev, ...newFiles]);
  };

  const handleStudentDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    handleStudentUpload(e.dataTransfer.files);
  };

  const handleModelUpload = (files: FileList | null) => {
    if (!files) return;
    setModelSolution(files[0]);
  };

  const handleModelDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    handleModelUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => e.preventDefault();
  const removeStudentFile = (index: number) =>
    setStudentPapers(studentPapers.filter((_, i) => i !== index));

  return (
    <div className="p-8 bg-background text-primary min-h-screen space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Paper Analysis</h1>
          <p className="text-primary/50">Upload a model solution and student sheet to generate AI insights.</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="grid md:grid-cols-2 gap-5">

        {/* Student Paper */}
        <div className="bg-white border border-primary/10 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-secondary/10 p-2 rounded-xl">
                <Upload size={16} />
              </div>
              <div>
                <h2 className="font-bold text-primary text-sm">Student Paper</h2>
                <p className="text-xs text-primary/40">Answer sheet upload</p>
              </div>
            </div>
            <span className="text-xs font-semibold bg-accent/10 text-accent px-2.5 py-1 rounded-full">
              Free: 1 file
            </span>
          </div>

          <label
            onDrop={handleStudentDrop}
            onDragOver={handleDragOver}
            className="flex flex-col items-center justify-center border-2 border-dashed border-primary/15 rounded-xl p-8 cursor-pointer hover:border-secondary/40 hover:bg-secondary/5 transition-all group"
          >
            <div className="bg-primary/5 group-hover:bg-secondary/10 p-4 rounded-2xl mb-3 transition-colors">
              <Upload size={24} className="text-primary/40 group-hover:text-secondary transition-colors" />
            </div>
            <span className="text-sm font-medium text-primary/60 group-hover:text-primary transition-colors">
              Drop file here or <span className="text-secondary font-semibold">browse</span>
            </span>
            <span className="text-xs text-primary/30 mt-1">PDF, PNG, JPG supported</span>
            <input type="file" multiple accept=".pdf,.png,.jpg,.jpeg" className="hidden"
              onChange={(e) => handleStudentUpload(e.target.files)} />
          </label>

          {studentPapers.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {studentPapers.map((file, index) => (
                <div key={index} className="flex items-center gap-2 bg-secondary/5 border border-secondary/20 rounded-xl px-3 py-2 relative group">
                  {file.type.startsWith("image/") ? (
                    <img src={URL.createObjectURL(file)} className="w-8 h-8 object-cover rounded-lg" />
                  ) : (
                    <div className="bg-secondary/10 p-1.5 rounded-lg">
                      <FileText size={16} className="text-secondary" />
                    </div>
                  )}
                  <p className="text-xs font-medium text-primary max-w-25 truncate">{file.name}</p>
                  <button onClick={() => removeStudentFile(index)}
                    className="ml-1 bg-primary/10 hover:bg-gray-500/20 text-primary hover:text-white w-5 h-5 rounded-full flex items-center justify-center transition-colors">
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {showUpgrade && (
            <div className="border border-accent/30 bg-accent/8 rounded-xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Crown size={16} className="text-accent shrink-0" />
                <p className="text-xs font-medium text-primary">Bulk upload available on <span className="font-bold">Pro plan</span></p>
              </div>
              <button className="bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity shrink-0">
                Upgrade
              </button>
            </div>
          )}
        </div>

        {/* Model Solution */}
        <div className="bg-white border border-primary/10 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/8 p-2 rounded-xl">
              <FileText size={16} className="text-primary/60" />
            </div>
            <div>
              <h2 className="font-bold text-primary text-sm">Model Solution</h2>
              <p className="text-xs text-primary/40">Reference answer key</p>
            </div>
          </div>

          <label
            onDrop={handleModelDrop}
            onDragOver={handleDragOver}
            className="flex flex-col items-center justify-center border-2 border-dashed border-primary/15 rounded-xl p-8 cursor-pointer hover:border-secondary/40 hover:bg-secondary/5 transition-all group"
          >
            <div className="bg-primary/5 group-hover:bg-secondary/10 p-4 rounded-2xl mb-3 transition-colors">
              <FileText size={24} className="text-primary/40 group-hover:text-secondary transition-colors" />
            </div>
            <span className="text-sm font-medium text-primary/60 group-hover:text-primary transition-colors">
              Drop file here or <span className="text-secondary font-semibold">browse</span>
            </span>
            <span className="text-xs text-primary/30 mt-1">PDF, PNG, JPG supported</span>
            <input type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden"
              onChange={(e) => handleModelUpload(e.target.files)} />
          </label>

          {modelSolution && (
            <div className="flex items-center gap-3 bg-secondary/5 border border-secondary/20 rounded-xl px-4 py-3">
              {modelSolution.type.startsWith("image/") ? (
                <img src={URL.createObjectURL(modelSolution)} className="w-9 h-9 object-cover rounded-lg shrink-0" />
              ) : (
                <div className="bg-secondary/10 p-2 rounded-lg shrink-0">
                  <FileText size={18} className="text-secondary" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-primary truncate">{modelSolution.name}</p>
                <p className="text-xs text-primary/40">{(modelSolution.size / 1024).toFixed(1)} KB</p>
              </div>
              <CheckCircle size={16} className="text-secondary shrink-0" />
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-center">
        <Button variant="primary">
          <Sparkles size={18} />
          Generate Insights
        </Button>
      </div>

      {/* Insights */}
      <div>
        <p className="text-sm font-bold uppercase tracking-widest mb-4">AI Insights</p>
        <div className="grid lg:grid-cols-3 gap-5">
          <InsightCard
            variant="success"
            icon={<CheckCircle size={18} />}
            title="Key Strengths"
            text="Most students demonstrated strong conceptual understanding and structured reasoning."
          />
          <InsightCard
            variant="warning"
            icon={<AlertTriangle size={18} />}
            title="Common Weaknesses"
            text="Several students struggled with applying formulas correctly and skipped intermediate steps."
          />
          <InsightCard
            variant="info"
            icon={<Lightbulb size={18} />}
            title="AI Recommendation"
            text="Reinforce formula application and encourage step-by-step solutions in upcoming lessons."
          />
        </div>
      </div>

    </div>
  );
}