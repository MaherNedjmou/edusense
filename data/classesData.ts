// Shared data — import this in both ClassesPage and ClassDetailPage

export const BANNER_COLORS = [
  "from-[#334155] to-[#1e293b]",
  "from-[#10B981] to-[#059669]",
  "from-[#F59E0B] to-[#d97706]",
  "from-[#3b82f6] to-[#1d4ed8]",
  "from-[#8b5cf6] to-[#6d28d9]",
  "from-[#ef4444] to-[#b91c1c]",
];

export const CLASSES_DATA: Record<string, {
  name: string;
  subject: string;
  description: string;
  code: string;
  color: string;
  studentCount: number;
}> = {
  "mathematics-grade-10": {
    name: "grp 4 SDIA",
    subject: "Mathematics",
    description: "Algebra, geometry, and calculus fundamentals for 10th grade students.",
    code: "MAT10X",
    color: "from-[#334155] to-[#1e293b]",
    studentCount: 28,
  },
  "physics-grade-11": {
    name: "grp 11 SDSI",
    subject: "Physics",
    description: "Mechanics, thermodynamics, and electromagnetism.",
    code: "PHY11B",
    color: "from-[#3b82f6] to-[#1d4ed8]",
    studentCount: 24,
  },
  "chemistry-grade-10": {
    name: "grp 10",
    subject: "Chemistry",
    description: "Atomic structure, periodic table, and chemical reactions.",
    code: "CHE10A",
    color: "from-[#10B981] to-[#059669]",
    studentCount: 30,
  },
  "biology-grade-12": {
    name: "grp 12",
    subject: "Biology",
    description: "Cell biology, genetics, and evolution for final-year students.",
    code: "BIO12C",
    color: "from-[#F59E0B] to-[#d97706]",
    studentCount: 22,
  },
};

export const MOCK_STUDENTS = [
  "Amira Hassan",
  "Karim Youssef",
  "Lina Samir",
  "Omar Faris",
  "Sara Malik",
];