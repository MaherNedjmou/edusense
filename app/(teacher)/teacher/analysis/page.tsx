"use client";

import { Upload, FileText, Brain, Sparkles, Crown, X } from "lucide-react";
import { useState } from "react";

export default function AnalysisPage() {
  const [modelSolution, setModelSolution] = useState<File | null>(null);
  const [studentPapers, setStudentPapers] = useState<File[]>([]);
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Student Paper Upload
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

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const removeStudentFile = (index: number) => {
    setStudentPapers(studentPapers.filter((_, i) => i !== index));
  };

  // Model Solution Upload
  const handleModelUpload = (files: FileList | null) => {
    if (!files) return;
    setModelSolution(files[0]);
  };

  const handleModelDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    handleModelUpload(e.dataTransfer.files);
  };

  return (
    <div className="p-8 bg-background text-primary min-h-screen space-y-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">AI Paper Analysis</h1>
        <p className="text-primary/70">
          Upload the model solution and a student answer sheet to generate AI insights.
        </p>
      </div>

      {/* Upload Section */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Student Paper Upload */}
        <div className="bg-background border border-primary/10 rounded-2xl p-6 shadow-sm">

          <div className="flex items-center gap-2 mb-4">
            <Upload size={20} />
            <h2 className="font-semibold">Student Paper</h2>
          </div>

          <label
            onDrop={handleStudentDrop}
            onDragOver={handleDragOver}
            className="flex flex-col items-center justify-center border-2 border-dashed border-primary/20 rounded-xl p-10 cursor-pointer hover:bg-secondary/5 transition"
          >
            <Upload size={28} className="mb-2 text-primary/70" />
            <span className="text-sm text-primary/70">
              Upload student answer sheet
            </span>
            <span className="text-xs text-secondary">
              Free plan: 1 file only
            </span>
            <input
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => handleStudentUpload(e.target.files)}
            />
          </label>

          {/* Uploaded Files */}
          {studentPapers.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-4">
              {studentPapers.map((file, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center bg-secondary/5 border border-primary/10 rounded-lg p-3 w-24 relative"
                >
                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <FileText size={28} className="text-primary/70" />
                  )}
                  <p className="text-xs text-center mt-1 truncate w-full">
                    {file.name}
                  </p>
                  <button
                    onClick={() => removeStudentFile(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {showUpgrade && (
            <div className="mt-4 border border-accent/40 bg-accent/10 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown size={18} className="text-accent" />
                <p className="text-sm text-primary">
                  Bulk upload is available in the Pro plan.
                </p>
              </div>
              <button className="bg-accent text-white px-3 py-1 rounded-lg text-sm hover:opacity-90">
                Upgrade
              </button>
            </div>
          )}

        </div>

        {/* Model Solution Upload */}
        <div className="bg-background border border-primary/10 rounded-2xl p-6 shadow-sm">

          <div className="flex items-center gap-2 mb-4">
            <FileText size={20} />
            <h2 className="font-semibold">Model Solution</h2>
          </div>

          <label
            onDrop={handleModelDrop}
            onDragOver={handleDragOver}
            className="flex flex-col items-center justify-center border-2 border-dashed border-primary/20 rounded-xl p-10 cursor-pointer hover:bg-secondary/5 transition"
          >
            <Upload size={28} className="mb-2 text-primary/70" />
            <span className="text-sm text-primary/70">
              Upload model solution
            </span>
            <span className="text-xs text-primary/50">
              PDF, PNG, JPG
            </span>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => handleModelUpload(e.target.files)}
            />
          </label>

          {modelSolution && (
            <div className="flex flex-col items-center gap-2 mt-4">
              {modelSolution.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(modelSolution)}
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <FileText size={28} className="text-primary/70" />
              )}
              <span className="text-sm text-center truncate w-full">{modelSolution.name}</span>
            </div>
          )}

        </div>

      </div>

      {/* Run AI Analysis */}
      <div className="flex justify-center">
        <button className="flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-xl shadow hover:opacity-90 transition">
          <Brain size={18} />
          Run AI Analysis
        </button>
      </div>

      {/* Insights Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        <InsightCard
          title="Key Strengths"
          text="Most students demonstrated strong conceptual understanding and structured reasoning."
          color="secondary"
        />
        <InsightCard
          title="Common Weaknesses"
          text="Several students struggled with applying formulas correctly and skipped intermediate steps."
          color="accent"
        />
        <InsightCard
          title="AI Recommendation"
          text="Reinforce formula application and encourage step-by-step solutions in upcoming lessons."
          color="secondary"
        />
      </div>

    </div>
  );
}

function InsightCard({
  title,
  text,
  color,
}: {
  title: string;
  text: string;
  color: "secondary" | "accent";
}) {
  return (
    <div className="bg-background border border-primary/10 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles
          size={18}
          className={color === "accent" ? "text-accent" : "text-secondary"}
        />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-primary/70 leading-relaxed">
        {text}
      </p>
    </div>
  );
}