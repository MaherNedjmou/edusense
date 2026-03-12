"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { CLASSES_DATA } from "@/data/classesData";
import FormCreateClass from "@/components/Forms/FormCreateClass";
import Button from "@/components/UI/Button";
import ClassCard from "@/components/UI/ClassCard";

const INITIAL_CLASSES = Object.entries(CLASSES_DATA).map(([id, cls]) => ({
  id,
  ...cls,
  sectionCount: 0,
}));

export default function ClassesPage() {
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [showCreate, setShowCreate] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = (e: React.MouseEvent, id: string, code: string) => {
    e.preventDefault();
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="p-8 bg-background min-h-screen space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">My Classes</h1>
          <p className="text-primary/70">
            {classes.length} active classes · {classes.reduce((a, c) => a + c.studentCount, 0)} students total
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowCreate(true)}>
          <Plus size={14} />
          Create Class
        </Button>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {classes.map((cls) => (
          <ClassCard
            key={cls.id}
            {...cls}
            copied={copied === cls.id}
            onCopy={copyCode}
          />
        ))}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <FormCreateClass
          onClose={() => setShowCreate(false)}
          onClassCreated={(newClass) => setClasses((prev) => [...prev, newClass])}
        />
      )}

    </div>
  );
}