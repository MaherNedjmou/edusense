"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, MoreVertical, X, Award, Calendar, CheckCircle, AlertCircle, TrendingUp, UserPlus, Filter, ShieldCheck, User, ExternalLink } from "lucide-react";
import { MOCK_STUDENTS } from "@/data/classesData";
import Button from "@/components/UI/Button";
import StudentMiniTrendChart from "@/components/Charts/StudentMiniTrendChart";
import api from "@/lib/api";
interface Student {
  id: string;
  name: string;
  email: string;
  type: "real" | "local";
}

interface PeopleTabProps {
  cls: {
    studentCount: number;
    [key: string]: any;
  };
  classId: string;
}

export default function PeopleTab({ cls, classId }: PeopleTabProps) {
  // const [students, setStudents] = useState<Student[]>(
  //   MOCK_STUDENTS.map(name => ({
  //     name,
  //     email: `${name.toLowerCase().replace(" ", ".")}@school.edu`,
  //     type: "real"
  //   }))
  // );
  const [students, setStudents] = useState<Student[]>([]);

  const [filterType, setFilterType] = useState<"all" | "real" | "local">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [perStudentData, setPerStudentData] = useState<Record<string, any>>({});
  const studentData = selectedStudent ? perStudentData[selectedStudent] : null;

  const filteredStudents = useMemo(() => {
    if (filterType === "all") return students;
    return students.filter(s => s.type === filterType);
  }, [students, filterType]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, statsRes] = await Promise.all([
          api.get<any>(`/student-classes/${cls._id}`),
          api.get<any>(`/student-classes/stats/${cls._id}`)
        ]);

        if (studentsRes) {
          setStudents(studentsRes.map((item: any) => ({
            id: item._id,
            name: item.student?.user?.firstName ? item.student.user.firstName + " " + item.student.user.lastName : (item.student?.name || "Unknown"),
            email: item.student?.user?.email || "no-email@local.edu",
            type: item.student?.user?.isRealUser ? "real" : "local",
          })));
        }
        if (statsRes) {
          setPerStudentData(statsRes);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [cls._id]);

  const addLocalStudent = () => {
    if (!newName.trim()) return;
    const newStudent: Student = {
      id: "",
      name: newName,
      email: newEmail || `${newName.toLowerCase().replace(" ", ".")}@local.edu`,
      type: "local"
    };
    setStudents(prev => [newStudent, ...prev]);
    setNewName("");
    setNewEmail("");
    setShowAddModal(false);
  };

  return (
    <div className="max-w-3xl mx-auto relative px-4 sm:px-0 space-y-4">

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-primary/10 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-1 bg-primary/2 p-1 rounded-xl w-full sm:w-auto">
          {(["all", "real", "local"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all uppercase tracking-widest ${filterType === t
                ? "bg-white text-secondary shadow-sm border border-secondary/10"
                : "text-primary/40 hover:text-primary/60"
                }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="text-xs flex-1 sm:flex-none">
            Invite
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowAddModal(true)}
            className="text-xs flex-1 sm:flex-none"
          >
            <UserPlus size={12} /> Add Local
          </Button>
        </div>
      </div>

      <div className="bg-white border border-primary/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-primary/8 flex items-center justify-between bg-primary/2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/30">
            Student Roster · {filteredStudents.length}
          </p>
        </div>
        <div className="divide-y divide-primary/8">
          {filteredStudents.length === 0 ? (
            <div className="px-6 py-20 text-center space-y-2">
              <div className="flex justify-center text-primary/10"><User size={48} /></div>
              <p className="text-sm font-bold text-primary/40">No students found for this filter</p>
            </div>
          ) : (
            filteredStudents.map((student, i) => (
              <div
                key={i}
                onClick={() => setSelectedStudent(student.name)}
                className="px-6 py-4 flex items-center gap-4 hover:bg-primary/3 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-sm font-bold text-secondary shrink-0 border border-secondary/5">
                  {student.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-primary group-hover:text-secondary transition-colors truncate">{student.name}</p>
                    {student.type === "real" ? (
                      <div className="flex items-center gap-1 bg-green-50 text-[10px] text-green-600 px-1.5 py-0.5 rounded-md border border-green-100 font-bold shrink-0">
                        <ShieldCheck size={10} /> Real
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 bg-amber-50 text-[10px] text-amber-600 px-1.5 py-0.5 rounded-md border border-amber-100 font-bold shrink-0">
                        <User size={10} /> Local
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-primary/40 truncate">
                    {student.email}
                  </p>
                </div>

                {/* Mini Trend for high-performing students */}
                {perStudentData[student.name] && perStudentData[student.name].trend && perStudentData[student.name].trend.length > 0 && (
                  <div className="hidden sm:block w-16 h-8 opacity-40 group-hover:opacity-100 transition-opacity">
                    <StudentMiniTrendChart trend={perStudentData[student.name].trend} />
                  </div>
                )}

                <button className="text-primary/20 hover:text-primary transition-colors p-1.5 hover:bg-primary/5 rounded-lg">
                  <MoreVertical size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Local Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-primary">Add Local Student</h3>
              <p className="text-xs text-primary/40 mt-1">Create a student record manually without sending an invite.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-primary/30 tracking-widest px-1">Full Name</label>
                <input
                  autoFocus
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Jean Dupont"
                  className="w-full bg-primary/2 border border-primary/10 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-primary/30 tracking-widest px-1">Email Address (Optional)</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="jean.dupont@local.edu"
                  className="w-full bg-primary/2 border border-primary/10 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={() => setShowAddModal(false)} variant="outline" className="flex-1">Cancel</Button>
              <Button onClick={addLocalStudent} variant="primary" className="flex-1">Create Student</Button>
            </div>
          </div>
        </div>
      )}

      {/* Student Details Modal Overlay */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-primary/40 backdrop-blur-sm shadow-2xl"
            onClick={() => setSelectedStudent(null)}
          />

          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-primary/10 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-primary/5 flex items-center justify-between bg-primary/2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-white text-lg font-black shadow-lg shadow-secondary/30">
                  {selectedStudent.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-primary">{selectedStudent}</h2>
                  <p className="text-xs text-primary/40 font-medium">Student Performance Overview</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-2 hover:bg-primary/5 rounded-xl text-primary/30 hover:text-primary transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto space-y-8">
              {studentData ? (
                <>
                  {/* Summary Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-secondary/5 rounded-2xl border border-secondary/10">
                      <p className="text-[10px] font-bold text-secondary/60 uppercase tracking-widest mb-1">Average</p>
                      <p className="text-xl font-black text-secondary">{(studentData.exams.reduce((acc: number, ex: any) => acc + ex.score, 0) / studentData.exams.length).toFixed(1)}%</p>
                    </div>
                    <div className="p-4 bg-primary/2 rounded-2xl border border-primary/5">
                      <p className="text-[10px] font-bold text-primary/30 uppercase tracking-widest mb-1">Exams</p>
                      <p className="text-xl font-black text-primary">{studentData.exams.length}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                      <p className="text-[10px] font-bold text-green-600/60 uppercase tracking-widest mb-1">Rank</p>
                      <p className="text-xl font-black text-green-700">Top 10%</p>
                    </div>
                  </div>

                  {/* Trend & Skills */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-primary/30 uppercase tracking-widest">
                        <TrendingUp size={14} /> Performance Trend
                      </div>
                      <div className="h-40 bg-primary/2 rounded-2xl border border-primary/5 p-4">
                        <StudentMiniTrendChart trend={studentData.trend} />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-primary/30 uppercase tracking-widest">
                        <Award size={14} /> Skill Summary
                      </div>
                      <div className="space-y-2">
                        {studentData.strengths.map((s: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 text-[11px] font-bold rounded-xl border border-green-100">
                            <CheckCircle size={12} /> {s}
                          </div>
                        ))}
                        {studentData.weaknesses.map((w: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 px-3 py-2 bg-orange-50 text-orange-700 text-[11px] font-bold rounded-xl border border-orange-100">
                            <AlertCircle size={12} /> {w}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Exam History */}
                  <div className="space-y-4">
                    <div className="text-xs font-bold text-primary/30 uppercase tracking-widest">Exam History & AI Feedback</div>
                    <div className="space-y-3">
                      {studentData.exams.map((exam: any, i: number) => (
                        <div key={i} className="p-4 border border-primary/8 rounded-2xl hover:bg-primary/2 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-sm text-primary">{exam.title}</h4>
                              <div className="flex items-center gap-2 text-[10px] text-primary/40 mt-0.5 font-medium">
                                <Calendar size={10} /> {exam.date}
                              </div>
                            </div>
                            <div className="text-sm font-black text-secondary">{exam.grade} ({exam.score}%)</div>
                          </div>
                          <p className="text-xs text-primary/60 italic leading-relaxed bg-white/50 p-3 rounded-xl border border-primary/5">
                            "{exam.feedback}"
                          </p>
                          {exam.answers && exam.answers.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {exam.answers.map((ans: any, idx: number) => (
                                <a
                                  key={idx}
                                  href={ans.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/5 hover:bg-secondary/10 text-[10px] font-bold text-secondary hover:text-secondary-dark rounded-lg border border-secondary/10 transition-all group/link"
                                >
                                  <ExternalLink size={10} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                  View Answer {exam.answers.length > 1 ? idx + 1 : ""}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center text-primary/20">
                    <TrendingUp size={32} />
                  </div>
                  <div>
                    <p className="font-bold text-primary">Detailed data pending</p>
                    <p className="text-xs text-primary/40 max-w-xs">AI is still processing previous exams for this student to generate full insights.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="px-8 py-5 bg-primary/2 border-t border-primary/5 flex justify-end gap-3">
              <Button onClick={() => setSelectedStudent(null)} variant="outline" className="text-xs">Close</Button>
              <Button variant="primary" className="text-xs">Full Report</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

