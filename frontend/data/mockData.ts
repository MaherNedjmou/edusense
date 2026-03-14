
export const DASHBOARD_STATS = {
  teacher: [
    { label: "Classes", value: "4" },
    { label: "Students", value: "96" },
    { label: "Submissions", value: "210" },
    { label: "AI Analyses", value: "210" },
  ],
  student: [
    { label: "Enrolled Classes", value: "6" },
    { label: "Assignments Done", value: "48" },
    { label: "Avg. Grade", value: "B+" },
    { label: "AI Feedbacks", value: "12" },
  ]
};

export const RECENT_ACTIVITIES = [
  { student: "Amira Hassan", exam: "Math Final", status: "Completed", time: "2h ago" },
  { student: "Karim Youssef", exam: "Physics Test", status: "Completed", time: "5h ago" },
  { student: "Lina Samir", exam: "Chemistry Quiz", status: "Processing", time: "1d ago" },
  { student: "Omar Faris", exam: "Biology Lab", status: "Completed", time: "1d ago" },
  { student: "Sara Malik", exam: "Algebra Quiz", status: "Completed", time: "2d ago" },
];

export const CHART_DATA = {
  submissions: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    data: [12, 19, 10, 24, 18, 27, 15],
  },
  performance: {
    labels: ["Excellent", "Good", "Average", "Needs Improvement"],
    data: [25, 35, 25, 15],
  },
  strengthWeakness: {
    labels: ["Concept", "Problem Solving", "Accuracy", "Speed"],
    strengths: [85, 70, 75, 50],
    weaknesses: [15, 30, 25, 50],
  }
};

export const CLASS_SECTIONS_DATA: Record<string, any[]> = {
  "mathematics-grade-10": [
    {
      id: 1,
      title: "Introduction to Algebra",
      description: "Basics of variables, constants and terms.",
      modelSolutionName: "algebra_basics_key.pdf"
    },
    {
      id: 2,
      title: "Linear Equations",
      description: "Solving for one variable in linear equations.",
    }
  ],
  "physics-grade-11": [
    {
      id: 1,
      title: "Newton's Laws",
      description: "Understanding force, mass and acceleration.",
      modelSolutionName: "newton_key.png"
    }
  ]
};

export const STUDENT_COURSES = [
  { id: "math-10", name: "Mathematics G-10", teacher: "Prof. Sarah", progress: 85, color: "from-[#334155] to-[#1e293b]" },
  { id: "phys-11", name: "Physics G-11", teacher: "Mr. Ahmed", progress: 70, color: "from-[#3b82f6] to-[#1d4ed8]" },
  { id: "chem-10", name: "Chemistry G-10", teacher: "Dr. Laila", progress: 92, color: "from-[#10B981] to-[#059669]" },
];

export const STUDENT_EXAMS: Record<string, any[]> = {
  "math-10": [
    { 
      id: 101, 
      title: "Algebra Quiz 1", 
      date: "Oct 12, 2023", 
      grade: "A-", 
      score: 92,
      feedback: "Excellent grasp of variables, minor arithmetic errors.", 
      strengths: ["Variable manipulation", "Equation setup"], 
      weaknesses: ["Arithmetic accuracy"] 
    },
    { 
      id: 102, 
      title: "Linear Equations Test", 
      date: "Nov 05, 2023", 
      grade: "B", 
      score: 84,
      feedback: "Strong logic, but struggled with multi-step calculations. Needs practice in complex fractions.", 
      strengths: ["Logic", "Substitution method"], 
      weaknesses: ["Mathematical calculation", "Step-by-step documentation"] 
    }
  ]
};

export const STUDENT_PERFORMANCE_TRENDS: Record<string, any> = {
  "math-10": {
    labels: ["Quiz 1", "Quiz 2", "Test 1", "Midterm", "Quiz 3"],
    data: [82, 85, 78, 88, 92]
  }
};

export const PER_STUDENT_DATA: Record<string, any> = {
  "Amira Hassan": {
    exams: [
      { title: "Algebra Quiz 1", grade: "A-", score: 92, feedback: "Excellent grasp of variables.", date: "Oct 12, 2023" },
      { title: "Linear Equations", grade: "B+", score: 88, feedback: "Strong logic, watch for arithmetic.", date: "Nov 05, 2023" },
    ],
    trend: [85, 92, 88, 90, 95],
    strengths: ["Logic", "Variable manipulation"],
    weaknesses: ["Arithmetic accuracy"]
  },
  "Karim Youssef": {
    exams: [
      { title: "Algebra Quiz 1", grade: "C+", score: 78, feedback: "Needs practice in basic terms.", date: "Oct 12, 2023" },
      { title: "Linear Equations", grade: "B", score: 82, feedback: "Improving, but step-by-step logic needs work.", date: "Nov 05, 2023" },
    ],
    trend: [70, 75, 78, 80, 82],
    strengths: ["Visual graphing"],
    weaknesses: ["Mathematical calculation", "Logic"]
  },
  "Lina Samir": {
    exams: [
      { title: "Algebra Quiz 1", grade: "A", score: 96, feedback: "Perfect score in logic sections.", date: "Oct 12, 2023" },
      { title: "Linear Equations", grade: "A-", score: 93, feedback: "Very consistent performance.", date: "Nov 05, 2023" },
    ],
    trend: [90, 92, 96, 94, 98],
    strengths: ["Problem Solving", "Speed"],
    weaknesses: ["None identified"]
  }
};
