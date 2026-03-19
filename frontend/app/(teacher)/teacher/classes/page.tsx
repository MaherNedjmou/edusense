"use client";
import { useRefresh_class } from "@/store/useStore";
import { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import FormCreateClass from "@/components/Forms/FormCreateClass";
import Button from "@/components/UI/Button";
import ClassCard from "@/components/UI/ClassCard";
import api from "@/lib/api";
import { useStore } from "@/store/useStore";

export default function ClassesPage() {
  // const [classes, setClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const setData = useStore(state => state.setData);
  const getData = useStore(state => state.getData);
  const classes = getData("classes") as any[] || [];

  useEffect(() => {
    
    api.get<{ data: any[] }>("/classes/my")
      .then(res => {
        setData("classes", res.data);
        if (res.data) setData("classes", res.data); //setClasses(res.data);
      })
      .catch(err => console.error("Error fetching classes:", err))
      .finally(() => setIsLoading(false));
  }, []);

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
            {classes.length} active classes · {classes.reduce((a, c) => a + (c.studentCount || 0), 0)} students total
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowCreate(true)}>
          <Plus size={14} />
          Create Class
        </Button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={32} className="animate-spin text-primary/30" />
        </div>
      ) : classes.length === 0 ? (
        <div className="bg-white border border-primary/10 rounded-2xl p-10 flex flex-col items-center justify-center space-y-3">
          <p className="font-bold text-primary/40">You haven't created any classes yet.</p>
          <Button variant="outline" onClick={() => setShowCreate(true)}>Create Your First Class</Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {classes.map((cls) => (
            <ClassCard
              key={cls._id}
              id={cls._id}
              name={cls.name}
              subject={cls.subject}
              description={cls.description || ""}
              color={cls.color}
              code={cls._id}
              studentCount={cls.studentCount || 0}
              sectionCount={cls.sectionCount || 0}
              copied={copied === cls._id}
              onCopy={copyCode}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <FormCreateClass
          onClose={() => setShowCreate(false)}
          onClassCreated={(newClass) => setData("classes", [newClass, ...classes])}
        />
      )}

    </div>
  );
}
