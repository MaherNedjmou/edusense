"use client";

import { useState } from "react";
import { Plus, Upload, FileText, Crown, Brain, X, Clipboard } from "lucide-react";

interface ExamFile {
  studentName: string;
  file: File;
  submittedAt: Date;
}

interface Section {
  id: number;
  title: string;
  description: string;
  exams: ExamFile[];
  modelSolution?: File;
}

interface ClassItem {
  id: number;
  name: string;
  code: string;
  sections: Section[];
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [className, setClassName] = useState("");
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionDesc, setSectionDesc] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

  // Add class
  const addClass = () => {
    if (!className.trim()) return;
    const newClass: ClassItem = {
      id: Date.now(),
      name: className,
      code: generateCode(),
      sections: [],
    };
    setClasses((prev) => [...prev, newClass]);
    setClassName("");
  };

  // Add section
  const addSection = () => {
    if (!selectedClass || !sectionTitle.trim()) return;
    const newSection: Section = {
      id: Date.now(),
      title: sectionTitle,
      description: sectionDesc,
      exams: [],
    };
    setClasses((prev) =>
      prev.map((cls) =>
        cls.id === selectedClass.id
          ? { ...cls, sections: [...cls.sections, newSection] }
          : cls
      )
    );
    setSectionTitle("");
    setSectionDesc("");
  };

  // Teacher uploads model solution
  const handleModelUpload = (classId: number, sectionId: number, fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const model = fileList[0];
    setClasses((prev) =>
      prev.map((cls) =>
        cls.id === classId
          ? {
              ...cls,
              sections: cls.sections.map((sec) =>
                sec.id === sectionId ? { ...sec, modelSolution: model } : sec
              ),
            }
          : cls
      )
    );
  };

  return (
    <div className="p-8 bg-background min-h-screen space-y-8">
      <h1 className="text-3xl font-semibold">Classes</h1>

      {/* Create Class */}
      <div className="bg-background border border-primary/10 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-xl">Create New Class</h2>
        <input
          type="text"
          placeholder="Class Name"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="w-full border border-primary/20 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-secondary"
        />
        <button
          onClick={addClass}
          className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          <Plus size={18} /> Add Class
        </button>
      </div>

      {/* Classes */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="bg-background border border-primary/10 rounded-2xl p-6 shadow-sm space-y-4 cursor-pointer hover:bg-secondary/5 transition"
            onClick={() => setSelectedClass(cls)}
          >
            <h3 className="font-semibold text-lg">{cls.name}</h3>
            <div className="flex items-center gap-2">
              <Clipboard size={16} /> <span className="text-sm text-primary/70">Code: {cls.code}</span>
            </div>
            <p className="text-xs text-primary/50">Click to open sections</p>
          </div>
        ))}
      </div>

      {/* Selected Class Sections */}
      {selectedClass && (
        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-semibold">{selectedClass.name} - Sections</h2>

          {/* Add Section */}
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Section Title"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              className="w-full border border-primary/20 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <textarea
              placeholder="Section Description (instructions for students)"
              value={sectionDesc}
              onChange={(e) => setSectionDesc(e.target.value)}
              className="w-full border border-primary/20 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <button
              onClick={addSection}
              className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
              <Plus size={16} /> Add Section
            </button>
          </div>

          {/* Sections */}
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            {selectedClass.sections.map((sec) => (
              <div key={sec.id} className="bg-background border border-primary/10 rounded-2xl p-4 shadow-sm space-y-3">
                <h3 className="font-semibold text-lg">{sec.title}</h3>
                <p className="text-sm text-primary/70">{sec.description}</p>

                {/* Student submissions table */}
                {sec.exams.length > 0 ? (
                  <div className="overflow-x-auto border border-primary/20 rounded-lg">
                    <table className="min-w-full divide-y divide-primary/20 text-sm">
                      <thead className="bg-primary/5">
                        <tr>
                          <th className="px-4 py-2 text-left">Student</th>
                          <th className="px-4 py-2 text-left">File</th>
                          <th className="px-4 py-2 text-left">Submitted At</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-primary/20">
                        {sec.exams.map((exam, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-2">{exam.studentName}</td>
                            <td className="px-4 py-2">{exam.file.name}</td>
                            <td className="px-4 py-2">{exam.submittedAt.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-primary/50">No submissions yet</p>
                )}

                {/* Teacher uploads model solution */}
                <label className="flex flex-col items-center border-2 border-dashed border-primary/20 rounded-xl p-4 cursor-pointer hover:bg-secondary/5 transition mt-2">
                  <Upload size={28} className="mb-2 text-primary/70" />
                  <span className="text-sm text-primary/70">Upload Model Solution</span>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) => {
                      if (!e.target.files) return;
                      handleModelUpload(selectedClass.id, sec.id, e.target.files);
                    }}
                  />
                </label>

                {sec.modelSolution && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-primary/70">
                    <FileText size={16} /> <span>{sec.modelSolution.name}</span>
                  </div>
                )}

                {/* Bulk Analysis */}
                <button
                  disabled={!isPremium || !sec.modelSolution || sec.exams.length === 0}
                  onClick={() => alert(`Running AI analysis for ${sec.exams.length} exams!`)}
                  className={`flex items-center gap-2 w-full justify-center bg-secondary text-white px-4 py-2 rounded-lg hover:opacity-90 transition ${
                    !isPremium ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Brain size={16} />
                  Analyze Section
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showUpgrade && (
        <div className="fixed bottom-6 right-6 bg-accent/10 border border-accent/40 rounded-xl p-4 flex items-center gap-2">
          <Crown size={18} className="text-accent" />
          <span className="text-sm text-primary">
            Bulk upload is available in the Pro plan
          </span>
          <button className="ml-4 bg-accent text-white px-3 py-1 rounded-lg hover:opacity-90">
            Upgrade
          </button>
        </div>
      )}
    </div>
  );
}