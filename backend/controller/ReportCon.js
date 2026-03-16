// const PDFDocument = require("pdfkit");
// const fs = require("fs");

// const StudentClassAnswer = require("../model/Student_Class_Answer");
// const StudentClass = require("../model/Student_Class");
// const Feedback = require("../model/Feedback");
// const Exam = require("../model/Exam");
// const Class = require("../model/Class");

// // ─────────────────────────────────────────────
// // Helpers
// // ─────────────────────────────────────────────

// function grade(score) {
//   if (score >= 90) return "A";
//   if (score >= 80) return "B";
//   if (score >= 70) return "C";
//   if (score >= 60) return "D";
//   return "F";
// }

// // ─────────────────────────────────────────────
// // PDFKit Generators
// // ─────────────────────────────────────────────

// function generatePdfDoc(res, filename) {
//   const doc = new PDFDocument({ margin: 50, size: "A4" });
  
//   res.setHeader("Content-Type", "application/pdf");
//   res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  
//   doc.pipe(res);
//   return doc;
// }

// // Reusable drawing functions
// function drawHeader(doc, title, subtitle) {
//   // Top bar
//   doc.rect(0, 0, doc.page.width, 10).fill("#6366f1");

//   // Title block
//   doc.roundedRect(50, 40, doc.page.width - 100, 70, 8).fill("#f1f5f9");
//   doc.fillColor("#1e1e32").font("Helvetica-Bold").fontSize(22).text(title, 70, 55);
//   doc.fillColor("#6366f1").font("Helvetica").fontSize(14).text(subtitle, 70, 82);
//   doc.moveDown(2);
// }

// function drawInfoGrid(doc, leftCol, rightCol) {
//   const startY = doc.y;
  
//   doc.font("Helvetica-Bold").fontSize(11).fillColor("#1e1e32");
//   leftCol.forEach((item, i) => {
//     doc.text(item.label + ":", 50, startY + (i * 20));
//   });
  
//   doc.font("Helvetica").fillColor("#4b5563");
//   leftCol.forEach((item, i) => {
//     doc.text(item.value, 150, startY + (i * 20));
//   });

//   doc.font("Helvetica-Bold").fillColor("#1e1e32");
//   rightCol.forEach((item, i) => {
//     doc.text(item.label + ":", 320, startY + (i * 20));
//   });
  
//   doc.font("Helvetica").fillColor("#4b5563");
//   rightCol.forEach((item, i) => {
//     doc.text(item.value, 400, startY + (i * 20));
//   });

//   doc.y = startY + (Math.max(leftCol.length, rightCol.length) * 20) + 20;
// }

// function drawSectionHeader(doc, title) {
//   doc.moveDown(1);
//   doc.font("Helvetica-Bold").fontSize(14).fillColor("#1e1e32").text(title);
  
//   // Underline
//   doc.lineWidth(1).strokeColor("#6366f1")
//     .moveTo(50, doc.y + 2).lineTo(doc.page.width - 50, doc.y + 2).stroke();
//   doc.moveDown(1);
// }

// function drawCard(doc, title, content, icon, bgColor, borderColor, textColor, titleColor) {
//   // We need to calculate height first
//   const contentHeight = doc.heightOfString(content, { width: doc.page.width - 140, font: "Helvetica", fontSize: 11 });
//   const cardHeight = contentHeight + 40;

//   // Check if we need a page break
//   if (doc.y + cardHeight > doc.page.height - 50) {
//     doc.addPage();
//   }

//   const startY = doc.y;

//   doc.roundedRect(50, startY, doc.page.width - 100, cardHeight, 6)
//      .fillAndStroke(bgColor, borderColor);

//   doc.fillColor(titleColor).font("Helvetica-Bold").fontSize(12).text(`${icon} ${title}`, 70, startY + 15);
//   doc.fillColor(textColor).font("Helvetica").fontSize(11).text(content, 70, startY + 35, { width: doc.page.width - 140, lineGap: 4 });
  
//   doc.y = startY + cardHeight + 15;
// }


// // ─────────────────────────────────────────────
// // Build Exam Report
// // ─────────────────────────────────────────────
// function buildExamReportPdf(doc, data) {
//   drawHeader(doc, "Exam Analysis Report", data.examTitle);

//   drawInfoGrid(doc, 
//     [ { label: "Student", value: data.studentName }, { label: "Teacher", value: data.teacherName } ],
//     [ { label: "Class", value: data.className }, { label: "Date", value: data.date } ]
//   );

//   drawSectionHeader(doc, "Exam Information");

//   // Score row
//   const scoreY = doc.y + 10;
  
//   const drawStat = (x, label, value, valColor) => {
//     doc.font("Helvetica-Bold").fontSize(10).fillColor("#64748b").text(label, x, scoreY);
//     doc.font("Helvetica-Bold").fontSize(16).fillColor(valColor).text(value, x, scoreY + 15);
//   };

//   drawStat(50, "Score", `${data.scorePercent}%`, "#6366f1");
//   drawStat(150, "Max Score", `${data.maxScore} pts`, "#1e1e32");
//   drawStat(250, "Grade", data.gradeVal, "#6366f1");
//   drawStat(350, "Status", data.status, "#22c55e");

//   doc.y = scoreY + 50;

//   drawSectionHeader(doc, "Insights");
  
//   drawCard(doc, "Key Strengths", data.strengths, "✓", "#f0fdf4", "#86efac", "#166534", "#15803d");
//   drawCard(doc, "Key Insights", data.keyinsights, "★", "#eef2ff", "#a5b4fc", "#3730a3", "#4f46e5");

//   drawSectionHeader(doc, "Weaknesses & Areas for Improvement");
//   drawCard(doc, "Focus Areas", data.weaknesses, "⚠", "#fefce8", "#fde047", "#854d0e", "#a16207");

//   drawSectionHeader(doc, "Detailed Analysis & AI Evaluation");
//   drawCard(doc, "AI Teacher's Note", data.recommendation, "💡", "#f8fafc", "#e2e8f0", "#334155", "#1e293b");

//   // Footer
//   const pageCount = doc.bufferedPageRange ? doc.bufferedPageRange().count : 1;
//   doc.fontSize(9).fillColor("#94a3b8").text(`Generated by EduSense AI • ${data.date}`, 50, doc.page.height - 40, { align: "center" });
// }

// // ─────────────────────────────────────────────
// // Build Student Report
// // ─────────────────────────────────────────────
// function buildStudentReportPdf(doc, data) {
//   drawHeader(doc, "Student Performance Report", `${data.studentName} • ${data.className}`);

//   drawInfoGrid(doc, 
//     [ { label: "Student", value: data.studentName }, { label: "Enrolled", value: data.enrollDate } ],
//     [ { label: "Class", value: data.className }, { label: "Report Date", value: data.today } ]
//   );

//   drawSectionHeader(doc, "Performance Summary");

//   const scoreY = doc.y + 10;
//   const drawStat = (x, label, value, valColor) => {
//     doc.font("Helvetica-Bold").fontSize(10).fillColor("#64748b").text(label, x, scoreY);
//     doc.font("Helvetica-Bold").fontSize(16).fillColor(valColor).text(value, x, scoreY + 15);
//   };

//   drawStat(50, "Average Score", `${data.avgScore}%`, "#6366f1");
//   drawStat(170, "Highest Score", `${data.highScore}%`, "#22c55e");
//   drawStat(290, "Lowest Score", `${data.lowScore}%`, "#1e1e32");
//   drawStat(410, "Exams Taken", `${data.examCount}`, "#1e1e32");

//   doc.y = scoreY + 50;

//   drawSectionHeader(doc, "Exam History");

//   // Table header
//   const tableTop = doc.y + 10;
//   doc.rect(50, tableTop, doc.page.width - 100, 24).fill("#eef2ff");
//   doc.font("Helvetica-Bold").fontSize(10).fillColor("#3730a3");
//   doc.text("Exam Title", 60, tableTop + 7);
//   doc.text("Date", 300, tableTop + 7);
//   doc.text("Score", 400, tableTop + 7);
//   doc.text("Grade", 480, tableTop + 7);

//   let rowY = tableTop + 24;

//   if (data.exams.length === 0) {
//     doc.rect(50, rowY, doc.page.width - 100, 24).stroke("#e2e8f0");
//     doc.font("Helvetica").fontSize(10).fillColor("#64748b").text("No exam history available.", 60, rowY + 7);
//     rowY += 24;
//   } else {
//     data.exams.forEach((exam, i) => {
//       if (rowY > doc.page.height - 100) {
//         doc.addPage();
//         rowY = 50;
//       }
      
//       doc.rect(50, rowY, doc.page.width - 100, 24).stroke("#e2e8f0");
//       if (i % 2 === 0) doc.rect(50, rowY, doc.page.width - 100, 24).fill("#f8fafc");

//       doc.font("Helvetica-Bold").fontSize(10).fillColor("#1e293b").text(exam.title, 60, rowY + 7, { width: 230, lineBreak: false });
//       doc.font("Helvetica").fontSize(10).fillColor("#64748b").text(exam.date, 300, rowY + 7);
//       doc.font("Helvetica-Bold").fontSize(10).fillColor(exam.score >= 50 ? "#16a34a" : "#dc2626").text(`${exam.score}%`, 400, rowY + 7);
//       doc.font("Helvetica-Bold").fontSize(10).fillColor("#1e293b").text(exam.grade, 480, rowY + 7);
      
//       rowY += 24;
//     });
//   }

//   doc.y = rowY + 20;

//   drawSectionHeader(doc, "Performance Insights");

//   const strengthsText = data.strengths.map(s => `• ${s}`).join("\n");
//   const weaknessesText = data.weaknesses.map(w => `• ${w}`).join("\n");

//   drawCard(doc, "Strengths Across Exams", strengthsText, "✓", "#f0fdf4", "#86efac", "#166534", "#15803d");
//   drawCard(doc, "Weakness Patterns & Improvement Areas", weaknessesText, "⚠", "#fefce8", "#fde047", "#854d0e", "#a16207");

//   const trendText = data.trend.length > 0 ? `Score progression across ${data.trend.length} exams recorded.` : "Insufficient data for trend analysis.";
//   drawCard(doc, "Progress Trend", trendText, "📈", "#f8fafc", "#e2e8f0", "#334155", "#1e293b");

//   // Footer
//   doc.fontSize(9).fillColor("#94a3b8").text(`Generated by EduSense AI • ${data.today}`, 50, doc.page.height - 40, { align: "center" });
// }

// // ─────────────────────────────────────────────
// // Controller: Exam Analysis Report
// // GET /reports/exam/:analysisId
// // ─────────────────────────────────────────────
// const generateExamReport = async (req, res) => {
//   try {
//     const { analysisId } = req.params;

//     const answer = await StudentClassAnswer.findById(analysisId)
//       .populate({ path: "exam", populate: { path: "class" } })
//       .populate({ path: "studentClass", populate: { path: "student", populate: { path: "user" } } });

//     if (!answer) return res.status(404).json({ error: "Analysis not found" });

//     const feedback = await Feedback.findOne({ studentClassAnswer: analysisId });

//     const exam = answer.exam || {};
//     const cls = exam.class || {};
//     const sc = answer.studentClass || {};
//     const student = sc.student || {};
//     const user = student.user || {};

//     const studentName = user.firstName ? `${user.firstName} ${user.lastName}`.trim() : (student.name || "Unknown Student");
//     const className = cls.name || "Unknown Class";
//     const teacherName = req.user?.firstName ? `${req.user.firstName} ${req.user.lastName}`.trim() : "Teacher";
//     const examTitle = exam.title || "Unknown Exam";
//     const maxScore = exam.totalMarks || 100;
//     const rawScore = answer.score || (feedback?.rating ? Math.round((feedback.rating / 100) * maxScore) : 0);
//     const scorePercent = feedback?.rating || Math.round((rawScore / maxScore) * 100) || 0;
//     const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

//     const filename = `exam_report_${examTitle.replace(/\s+/g, "_")}_${studentName.replace(/\s+/g, "_")}.pdf`;
    
//     const doc = generatePdfDoc(res, filename);
    
//     buildExamReportPdf(doc, {
//       studentName,
//       className,
//       teacherName,
//       examTitle,
//       date,
//       score: rawScore,
//       maxScore,
//       scorePercent,
//       gradeVal: grade(scorePercent),
//       status: feedback ? "Processed" : "Pending",
//       strengths: feedback?.strengths || "Strong foundational understanding demonstrated.",
//       weaknesses: feedback?.weaknesses || "Areas for improvement will be identified with more data.",
//       keyinsights: feedback?.keyinsights || "Detailed AI insights based on paper evaluation.",
//       recommendation: feedback?.recommendation || "Continue practicing and reviewing core concepts."
//     });

//     doc.end();

//   } catch (err) {
//     console.error("Exam report error:", err);
//     if (!res.headersSent) res.status(500).json({ error: err.message });
//   }
// };

// // ─────────────────────────────────────────────
// // Controller: Student History Report
// // GET /reports/student/:studentId
// // ─────────────────────────────────────────────
// const generateStudentReport = async (req, res) => {
//   try {
//     const { studentId } = req.params;

//     const sc = await StudentClass.findById(studentId)
//       .populate({ path: "student", populate: { path: "user" } })
//       .populate("class");

//     if (!sc) return res.status(404).json({ error: "Student record not found" });

//     const student = sc.student || {};
//     const user = student.user || {};
//     const studentName = user.firstName ? `${user.firstName} ${user.lastName}`.trim() : (student.name || "Unknown Student");
//     const cls = sc.class || {};
//     const className = cls.name || "Unknown Class";
//     const enrollDate = sc.createdAt
//       ? new Date(sc.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
//       : "Unknown";
//     const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

//     const answers = await StudentClassAnswer.find({ studentClass: studentId })
//       .populate("exam")
//       .sort({ submittedAt: 1 });

//     const answerIds = answers.map(a => a._id);
//     const feedbacks = await Feedback.find({ studentClassAnswer: { $in: answerIds } });

//     const exams = answers.map(ans => {
//       const fb = feedbacks.find(f => f.studentClassAnswer?.toString() === ans._id?.toString());
//       const exam = ans.exam || {};
//       const maxMarks = exam.totalMarks || 100;
//       const scorePercent = fb?.rating || Math.round((ans.score / maxMarks) * 100) || 0;
//       return {
//         title: exam.title || "Unknown Exam",
//         date: ans.submittedAt
//           ? new Date(ans.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
//           : "—",
//         score: scorePercent,
//         grade: grade(scorePercent)
//       };
//     });

//     const scores = exams.map(e => e.score);
//     const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
//     const highScore = scores.length ? Math.max(...scores) : 0;
//     const lowScore = scores.length ? Math.min(...scores) : 0;

//     const allStrengths = [...new Set(
//       feedbacks.flatMap(f => f.strengths ? f.strengths.split(",").map(s => s.trim()) : []).filter(Boolean)
//     )].slice(0, 4);

//     const allWeaknesses = [...new Set(
//       feedbacks.flatMap(f => f.weaknesses ? f.weaknesses.split(",").map(w => w.trim()) : []).filter(Boolean)
//     )].slice(0, 4);

//     const filename = `student_report_${studentName.replace(/\s+/g, "_")}.pdf`;
    
//     const doc = generatePdfDoc(res, filename);

//     buildStudentReportPdf(doc, {
//       studentName,
//       className,
//       enrollDate,
//       today,
//       avgScore,
//       highScore,
//       lowScore,
//       examCount: exams.length,
//       exams,
//       strengths: allStrengths.length ? allStrengths : ["Consistent participation"],
//       weaknesses: allWeaknesses.length ? allWeaknesses : ["Continue reviewing core topics"],
//       trend: scores
//     });

//     doc.end();

//   } catch (err) {
//     console.error("Student report error:", err);
//     if (!res.headersSent) res.status(500).json({ error: err.message });
//   }
// };



// module.exports = { generateExamReport, generateStudentReport };


const PDFDocument = require("pdfkit");
const fs = require("fs");

const StudentClassAnswer = require("../model/Student_Class_Answer");
const StudentClass = require("../model/Student_Class");
const Feedback = require("../model/Feedback");
const Exam = require("../model/Exam");
const Class = require("../model/Class");

// ─────────────────────────────────────────────
// Design Tokens
// ─────────────────────────────────────────────
const COLORS = {
  // Brand
  primary:      "#4F46E5", // indigo-600
  primaryLight: "#EEF2FF", // indigo-50
  primaryMid:   "#818CF8", // indigo-400
  accent:       "#06B6D4", // cyan-500

  // Semantic
  success:      "#10B981", // emerald-500
  successLight: "#ECFDF5",
  successDark:  "#065F46",
  warning:      "#F59E0B", // amber-500
  warningLight: "#FFFBEB",
  warningDark:  "#78350F",
  danger:       "#EF4444",

  // Neutrals
  dark:         "#0F172A", // slate-900
  mid:          "#334155", // slate-700
  muted:        "#64748B", // slate-500
  subtle:       "#94A3B8", // slate-400
  border:       "#E2E8F0", // slate-200
  bg:           "#F8FAFC", // slate-50
  white:        "#FFFFFF",
};

const FONT = {
  bold:   "Helvetica-Bold",
  normal: "Helvetica",
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function grade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function gradeColor(g) {
  const map = { A: COLORS.success, B: "#3B82F6", C: COLORS.warning, D: "#F97316", F: COLORS.danger };
  return map[g] || COLORS.mid;
}

function scoreBarColor(score) {
  if (score >= 80) return COLORS.success;
  if (score >= 60) return COLORS.primary;
  if (score >= 40) return COLORS.warning;
  return COLORS.danger;
}

function hex2rgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

// ─────────────────────────────────────────────
// PDFKit Init
// ─────────────────────────────────────────────

function generatePdfDoc(res, filename) {
  const doc = new PDFDocument({ margin: 0, size: "A4", bufferPages: true });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  doc.pipe(res);
  return doc;
}

// ─────────────────────────────────────────────
// Shared Drawing Primitives
// ─────────────────────────────────────────────

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 48;
const CONTENT_W = PAGE_W - MARGIN * 2;

/** Draws the full-page background tint */
function drawPageBackground(doc) {
  doc.rect(0, 0, PAGE_W, PAGE_H).fill(COLORS.bg);
}

/** Top gradient-style hero banner */
function drawHero(doc, title, subtitle, badgeText) {
  // Deep background bar
  doc.rect(0, 0, PAGE_W, 130).fill(COLORS.dark);

  // Decorative accent stripe
  doc.rect(0, 0, 6, 130).fill(COLORS.primary);

  // Subtle diagonal overlay
  doc.save();
  doc.rect(0, 0, PAGE_W, 130).clip();
  doc.circle(PAGE_W - 40, -20, 130).fillOpacity(0.06).fill(COLORS.white);
  doc.circle(PAGE_W + 30, 80, 80).fillOpacity(0.04).fill(COLORS.primaryMid);
  doc.restore();

  // Badge pill
  if (badgeText) {
    const bx = MARGIN;
    doc.roundedRect(bx, 22, badgeText.length * 7 + 20, 20, 10)
       .fill(COLORS.primary);
    doc.font(FONT.bold).fontSize(9).fillColor(COLORS.white)
       .text(badgeText, bx + 10, 28, { lineBreak: false });
  }

  // Title
  doc.font(FONT.bold).fontSize(26).fillColor(COLORS.white)
     .text(title, MARGIN, 52, { lineBreak: false });

  // Subtitle
  doc.font(FONT.normal).fontSize(12).fillColor(COLORS.subtle)
     .text(subtitle, MARGIN, 84, { lineBreak: false });

  // EduSense brand mark (top-right)
  const brand = "EduSense AI";
  doc.font(FONT.bold).fontSize(10).fillColor(COLORS.primaryMid)
     .text(brand, 0, 20, { align: "right", width: PAGE_W - MARGIN, lineBreak: false });
}

/** Pill-shaped meta row below hero — values wrap up to 2 lines, then ellipsis */
function drawMetaStrip(doc, items) {
  const stripY   = 130;
  const colW     = CONTENT_W / items.length;
  const valPad   = 8;
  const maxValW  = colW - valPad - 6;   // usable width per column
  const labelH   = 13;                  // height reserved for the label row
  const lineH    = 13;                  // line height for value text
  const maxLines = 2;
  const stripH   = labelH + lineH * maxLines + 16; // 8 top + 8 bottom padding

  doc.rect(0, stripY, PAGE_W, stripH).fill(COLORS.white);
  doc.rect(0, stripY + stripH - 1, PAGE_W, 1).fill(COLORS.border);

  items.forEach((item, i) => {
    const x = MARGIN + i * colW;

    // Vertical divider (skip first column)
    if (i > 0) {
      doc.rect(x - 1, stripY + 8, 1, stripH - 16).fill(COLORS.border);
    }

    // Label — always single line
    doc.font(FONT.normal).fontSize(9).fillColor(COLORS.subtle)
       .text(item.label.toUpperCase(), x + valPad, stripY + 8, {
         width: maxValW, lineBreak: false,
       });

    // Value — wrap up to 2 lines, ellipsis if too long
    doc.font(FONT.bold).fontSize(10).fillColor(COLORS.mid);
    const fullH = doc.heightOfString(item.value, { width: maxValW, lineGap: 2 });
    const maxH  = lineH * maxLines + 2;

    if (fullH <= maxH) {
      doc.text(item.value, x + valPad, stripY + 8 + labelH, {
        width: maxValW, lineGap: 2, ellipsis: true, height: maxH,
      });
    } else {
      // Single line with ellipsis as last resort
      doc.text(item.value, x + valPad, stripY + 8 + labelH, {
        width: maxValW, lineBreak: false, ellipsis: true,
      });
    }
  });

  // Return bottom Y of the strip so callers can offset layout correctly
  return stripY + stripH;
}

/** Section heading with colored left border */
function drawSectionTitle(doc, title, y) {
  doc.rect(MARGIN, y, 3, 18).fill(COLORS.primary);
  doc.font(FONT.bold).fontSize(12).fillColor(COLORS.dark)
     .text(title, MARGIN + 12, y + 2, { lineBreak: false });
  // Hairline rule
  doc.rect(MARGIN + 12, y + 20, CONTENT_W - 12, 0.5).fill(COLORS.border);
  return y + 32;
}

/** Stat card – compact KPI block */
function drawStatCard(doc, x, y, w, label, value, subValue, valueColor) {
  // Card background
  doc.roundedRect(x, y, w, 72, 6).fill(COLORS.white);
  doc.roundedRect(x, y, w, 72, 6).lineWidth(0.5).stroke(COLORS.border);

  // Accent top border
  doc.roundedRect(x, y, w, 4, 2).fill(valueColor);

  doc.font(FONT.normal).fontSize(8).fillColor(COLORS.muted)
     .text(label.toUpperCase(), x + 12, y + 14, { lineBreak: false });
  doc.font(FONT.bold).fontSize(22).fillColor(valueColor)
     .text(value, x + 12, y + 26, { lineBreak: false });
  if (subValue) {
    doc.font(FONT.normal).fontSize(9).fillColor(COLORS.subtle)
       .text(subValue, x + 12, y + 52, { lineBreak: false });
  }
}

/** Insight card — no icon circle, text wraps within card */
function drawInsightCard(doc, yStart, icon, title, body, bgColor, accentColor, textColor) {
  const textX   = MARGIN + 20;
  const textW   = CONTENT_W - 28; // left bar (4) + padding (16) each side
  const titleH  = 18;
  const bodyH   = doc.heightOfString(body, { width: textW, lineGap: 3 });
  const cardH   = Math.max(titleH + bodyH + 32, 60); // 16 top + 16 bottom padding

  // Page break guard
  if (yStart + cardH > PAGE_H - 60) {
    doc.addPage();
    drawPageBackground(doc);
    yStart = MARGIN;
  }

  // Card shadow illusion
  doc.roundedRect(MARGIN + 2, yStart + 2, CONTENT_W, cardH, 8)
     .fillOpacity(0.06).fill(COLORS.dark);

  // Card body
  doc.roundedRect(MARGIN, yStart, CONTENT_W, cardH, 8)
     .fillOpacity(1).fill(bgColor);
  doc.roundedRect(MARGIN, yStart, CONTENT_W, cardH, 8)
     .lineWidth(0.5).stroke(accentColor);

  // Left color bar
  doc.roundedRect(MARGIN, yStart, 4, cardH, 2).fill(accentColor);

  // Title
  doc.font(FONT.bold).fontSize(11).fillColor(textColor)
     .text(title, textX, yStart + 14, { width: textW, lineBreak: false });

  // Body text — wraps naturally inside card
  doc.font(FONT.normal).fontSize(10).fillColor(textColor)
     .text(body, textX, yStart + 14 + titleH, { width: textW, lineGap: 3 });

  return yStart + cardH + 12;
}

/** Score progress bar */
function drawScoreBar(doc, x, y, w, score, color) {
  const barH = 8;
  const radius = 4;
  // Track
  doc.roundedRect(x, y, w, barH, radius).fill(COLORS.border);
  // Fill
  const fillW = Math.max((score / 100) * w, barH);
  doc.roundedRect(x, y, fillW, barH, radius).fill(color);
}

/** Table for exam history */
function drawTable(doc, yStart, rows) {
  // Column definitions — all widths sum exactly to CONTENT_W (499)
  // MARGIN=48, so rightmost edge = MARGIN + CONTENT_W = 48 + 499 = 547 = PAGE_W - 48 ✓
  const COL_TITLE = { label: "Exam Title", key: "title", offset: 0,   w: 200 };
  const COL_DATE  = { label: "Date",       key: "date",  offset: 200, w: 100 };
  const COL_SCORE = { label: "Score",      key: "score", offset: 300, w: 60  };
  const COL_GRADE = { label: "Grade",      key: "grade", offset: 360, w: 46  };
  const COL_BAR   = { label: "Progress",   key: "bar",   offset: 406, w: 93  };
  const cols = [COL_TITLE, COL_DATE, COL_SCORE, COL_GRADE, COL_BAR];

  // Resolve absolute x positions
  cols.forEach(c => { c.x = MARGIN + c.offset; });

  const rowH   = 30;
  const barH   = 6;                          // bar height
  const barPad = 6;                          // inner horizontal padding for bar cell
  const barW   = COL_BAR.w - barPad * 2;    // usable bar width (81 px)
  const barY   = (rowH - barH) / 2;         // vertical center within row

  let y = yStart;

  // ── Header ──
  doc.roundedRect(MARGIN, y, CONTENT_W, rowH, 6).fill(COLORS.primary);
  cols.forEach(col => {
    doc.font(FONT.bold).fontSize(9).fillColor(COLORS.white)
       .text(col.label, col.x + 6, y + 9, { width: col.w - 8, lineBreak: false });
  });
  y += rowH;

  // ── Empty state ──
  if (rows.length === 0) {
    doc.rect(MARGIN, y, CONTENT_W, rowH).fill(COLORS.white);
    doc.rect(MARGIN, y, CONTENT_W, rowH).lineWidth(0.5).stroke(COLORS.border);
    doc.font(FONT.normal).fontSize(10).fillColor(COLORS.muted)
       .text("No exam history available.", MARGIN + 10, y + 9, { lineBreak: false });
    return y + rowH + 10;
  }

  // ── Data rows ──
  rows.forEach((row, i) => {
    if (y + rowH > PAGE_H - 60) {
      doc.addPage();
      drawPageBackground(doc);
      y = MARGIN;
    }

    // Row background
    const bg = i % 2 === 0 ? COLORS.white : COLORS.bg;
    doc.rect(MARGIN, y, CONTENT_W, rowH).fill(bg);
    doc.rect(MARGIN, y, CONTENT_W, rowH).lineWidth(0.5).stroke(COLORS.border);

    const sc     = Math.min(Math.max(Number(row.score) || 0, 0), 100); // clamp 0–100
    const sColor = sc >= 70 ? COLORS.success : sc >= 50 ? COLORS.warning : COLORS.danger;

    // Exam title (truncated to column width)
    doc.font(FONT.normal).fontSize(9).fillColor(COLORS.dark)
       .text(row.title, COL_TITLE.x + 6, y + 9, {
         width: COL_TITLE.w - 12, lineBreak: false, ellipsis: true,
       });

    // Date
    doc.font(FONT.normal).fontSize(9).fillColor(COLORS.muted)
       .text(row.date, COL_DATE.x + 6, y + 9, {
         width: COL_DATE.w - 8, lineBreak: false,
       });

    // Score
    doc.font(FONT.bold).fontSize(10).fillColor(sColor)
       .text(`${sc}%`, COL_SCORE.x + 6, y + 9, {
         width: COL_SCORE.w - 8, lineBreak: false,
       });

    // Grade badge (centered in column)
    const g  = row.grade || grade(sc);
    const gc = gradeColor(g);
    const badgeW = 28;
    const badgeX = COL_GRADE.x + Math.floor((COL_GRADE.w - badgeW) / 2);
    doc.roundedRect(badgeX, y + 7, badgeW, 16, 4).fill(gc);
    doc.font(FONT.bold).fontSize(9).fillColor(COLORS.white)
       .text(g, badgeX, y + 11, { width: badgeW, align: "center", lineBreak: false });

    // Progress bar — strictly contained inside COL_BAR
    const trackX  = COL_BAR.x + barPad;
    const trackY  = y + barY;
    const fillW   = Math.round((sc / 100) * barW); // proportional, integer pixels

    // Track (background)
    doc.roundedRect(trackX, trackY, barW, barH, 3).fill(COLORS.border);
    // Fill (score proportion) — only draw if score > 0
    if (fillW > 0) {
      doc.roundedRect(trackX, trackY, fillW, barH, 3).fill(sColor);
    }

    y += rowH;
  });

  return y + 12;
}

/** Page footer */
function drawFooter(doc, pageLabel) {
  const fy = PAGE_H - 30;
  doc.rect(0, fy - 6, PAGE_W, 36).fill(COLORS.dark);
  doc.rect(0, fy - 6, 4, 36).fill(COLORS.primary);

  doc.font(FONT.normal).fontSize(8).fillColor(COLORS.subtle)
     .text("Generated by EduSense AI  •  Confidential Student Report", MARGIN, fy + 4, { lineBreak: false });
  doc.font(FONT.normal).fontSize(8).fillColor(COLORS.subtle)
     .text(pageLabel, 0, fy + 4, { align: "right", width: PAGE_W - MARGIN, lineBreak: false });
}

// ─────────────────────────────────────────────
// Build Exam Report
// ─────────────────────────────────────────────

function buildExamReportPdf(doc, data) {
  drawPageBackground(doc);
  drawHero(doc, data.examTitle, "Exam Analysis Report", "EXAM REPORT");
  const stripBottom = drawMetaStrip(doc, [
    { label: "Student",  value: data.studentName },
    { label: "Teacher",  value: data.teacherName },
    { label: "Class",    value: data.className },
    { label: "Date",     value: data.date },
  ]);

  // ── Stats row ──
  let y = stripBottom + 14;
  const cardW = (CONTENT_W - 12) / 4;

  drawStatCard(doc, MARGIN,                  y, cardW, "Score",    `${data.scorePercent}%`, "Percentage",   scoreBarColor(data.scorePercent));
  drawStatCard(doc, MARGIN + cardW + 4,      y, cardW, "Max Score",`${data.maxScore} pts`,  "Total Points", COLORS.primary);
  drawStatCard(doc, MARGIN + (cardW + 4) * 2,y, cardW, "Grade",    data.gradeVal,            "Letter Grade", gradeColor(data.gradeVal));
  drawStatCard(doc, MARGIN + (cardW + 4) * 3,y, cardW, "Status",   data.status,              data.date,      data.status === "Processed" ? COLORS.success : COLORS.warning);

  // Score progress bar
  y += 90;
  doc.font(FONT.normal).fontSize(9).fillColor(COLORS.muted)
     .text("Overall Score Progress", MARGIN, y);
  y += 14;
  drawScoreBar(doc, MARGIN, y, CONTENT_W, data.scorePercent, scoreBarColor(data.scorePercent));
  doc.font(FONT.bold).fontSize(9).fillColor(scoreBarColor(data.scorePercent))
     .text(`${data.scorePercent}%`, MARGIN + CONTENT_W + 6, y - 1, { lineBreak: false });
  y += 24;

  // ── Insights ──
  y = drawSectionTitle(doc, "Performance Insights", y + 8);

  y = drawInsightCard(doc, y, "✓", "Key Strengths",
    data.strengths,
    COLORS.successLight, COLORS.success, COLORS.successDark);

  y = drawInsightCard(doc, y, "★", "Key Insights",
    data.keyinsights,
    COLORS.primaryLight, COLORS.primary, "#3730A3");

  y = drawInsightCard(doc, y, "⚠", "Focus Areas & Weaknesses",
    data.weaknesses,
    COLORS.warningLight, COLORS.warning, COLORS.warningDark);

  y = drawInsightCard(doc, y, "✎", "AI Teacher's Recommendation",
    data.recommendation,
    COLORS.white, COLORS.primaryMid, COLORS.mid);

  drawFooter(doc, data.date);
}

// ─────────────────────────────────────────────
// Build Student Report
// ─────────────────────────────────────────────

function buildStudentReportPdf(doc, data) {
  drawPageBackground(doc);
  drawHero(doc, data.studentName, `${data.className}  •  Student Performance Report`, "STUDENT REPORT");
  const stripBottom = drawMetaStrip(doc, [
    { label: "Class",       value: data.className },
    { label: "Enrolled",    value: data.enrollDate },
    { label: "Report Date", value: data.today },
    { label: "Exams Taken", value: String(data.examCount) },
  ]);

  // ── KPI row ──
  let y = stripBottom + 14;
  const cardW = (CONTENT_W - 12) / 4;

  drawStatCard(doc, MARGIN,                   y, cardW, "Average",  `${data.avgScore}%`,  "All Exams",     scoreBarColor(data.avgScore));
  drawStatCard(doc, MARGIN + cardW + 4,       y, cardW, "Highest",  `${data.highScore}%`, "Best Score",    COLORS.success);
  drawStatCard(doc, MARGIN + (cardW + 4) * 2, y, cardW, "Lowest",   `${data.lowScore}%`,  "Needs Attention", data.lowScore >= 50 ? COLORS.warning : COLORS.danger);
  drawStatCard(doc, MARGIN + (cardW + 4) * 3, y, cardW, "Exams",    `${data.examCount}`,  "Total Taken",   COLORS.primary);

  y += 86;

  // ── Exam History ──
  y = drawSectionTitle(doc, "Exam History", y + 8);
  y = drawTable(doc, y, data.exams);

  // ── Insights ──
  y = drawSectionTitle(doc, "Performance Insights", y + 8);

  const strengthsText = data.strengths.map(s => `• ${s}`).join("\n");
  const weaknessesText = data.weaknesses.map(w => `• ${w}`).join("\n");

  y = drawInsightCard(doc, y, "✓", "Strengths Across Exams",
    strengthsText,
    COLORS.successLight, COLORS.success, COLORS.successDark);

  y = drawInsightCard(doc, y, "⚠", "Weakness Patterns & Improvement Areas",
    weaknessesText,
    COLORS.warningLight, COLORS.warning, COLORS.warningDark);

  const trendText = data.trend.length > 0
    ? `Score progression tracked across ${data.trend.length} exam${data.trend.length > 1 ? "s" : ""}. ` +
      `Scores range from ${Math.min(...data.trend)}% to ${Math.max(...data.trend)}% with an average of ${data.avgScore}%.`
    : "Insufficient data for trend analysis. More exams needed to generate meaningful insights.";

  y = drawInsightCard(doc, y, "▲", "Progress Trend",
    trendText,
    COLORS.primaryLight, COLORS.primaryMid, "#3730A3");

  drawFooter(doc, data.today);
}

// ─────────────────────────────────────────────
// Controller: Exam Analysis Report
// GET /reports/exam/:analysisId
// ─────────────────────────────────────────────
const generateExamReport = async (req, res) => {
  try {
    const { analysisId } = req.params;

    const answer = await StudentClassAnswer.findById(analysisId)
      .populate({ path: "exam", populate: { path: "class" } })
      .populate({ path: "studentClass", populate: { path: "student", populate: { path: "user" } } });

    if (!answer) return res.status(404).json({ error: "Analysis not found" });

    const feedback = await Feedback.findOne({ studentClassAnswer: analysisId });

    const exam        = answer.exam || {};
    const cls         = exam.class || {};
    const sc          = answer.studentClass || {};
    const student     = sc.student || {};
    const user        = student.user || {};

    const studentName  = user.firstName ? `${user.firstName} ${user.lastName}`.trim() : (student.name || "Unknown Student");
    const className    = cls.name || "Unknown Class";
    const teacherName  = req.user?.firstName ? `${req.user.firstName} ${req.user.lastName}`.trim() : "Teacher";
    const examTitle    = exam.title || "Unknown Exam";
    const maxScore     = exam.totalMarks || 100;
    const rawScore     = answer.score || (feedback?.rating ? Math.round((feedback.rating / 100) * maxScore) : 0);
    const scorePercent = feedback?.rating || Math.round((rawScore / maxScore) * 100) || 0;
    const date         = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    const filename = `exam_report_${examTitle.replace(/\s+/g, "_")}_${studentName.replace(/\s+/g, "_")}.pdf`;
    const doc      = generatePdfDoc(res, filename);

    buildExamReportPdf(doc, {
      studentName, className, teacherName, examTitle, date,
      score: rawScore, maxScore, scorePercent,
      gradeVal:       grade(scorePercent),
      status:         feedback ? "Processed" : "Pending",
      strengths:      feedback?.strengths       || "Strong foundational understanding demonstrated.",
      weaknesses:     feedback?.weaknesses      || "Areas for improvement will be identified with more data.",
      keyinsights:    feedback?.keyinsights     || "Detailed AI insights based on paper evaluation.",
      recommendation: feedback?.recommendation  || "Continue practicing and reviewing core concepts.",
    });

    doc.end();

  } catch (err) {
    console.error("Exam report error:", err);
    if (!res.headersSent) res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────
// Controller: Student History Report
// GET /reports/student/:studentId
// ─────────────────────────────────────────────
const generateStudentReport = async (req, res) => {
  try {
    const { studentId } = req.params;

    const sc = await StudentClass.findById(studentId)
      .populate({ path: "student", populate: { path: "user" } })
      .populate("class");

    if (!sc) return res.status(404).json({ error: "Student record not found" });

    const student    = sc.student || {};
    const user       = student.user || {};
    const studentName = user.firstName ? `${user.firstName} ${user.lastName}`.trim() : (student.name || "Unknown Student");
    const cls        = sc.class || {};
    const className  = cls.name || "Unknown Class";
    const enrollDate = sc.createdAt
      ? new Date(sc.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : "Unknown";
    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    const answers = await StudentClassAnswer.find({ studentClass: studentId })
      .populate("exam").sort({ submittedAt: 1 });

    const answerIds = answers.map(a => a._id);
    const feedbacks = await Feedback.find({ studentClassAnswer: { $in: answerIds } });

    const exams = answers.map(ans => {
      const fb       = feedbacks.find(f => f.studentClassAnswer?.toString() === ans._id?.toString());
      const exam     = ans.exam || {};
      const maxMarks = exam.totalMarks || 100;
      const scorePercent = fb?.rating || Math.round((ans.score / maxMarks) * 100) || 0;
      return {
        title: exam.title || "Unknown Exam",
        date:  ans.submittedAt
          ? new Date(ans.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          : "—",
        score: scorePercent,
        grade: grade(scorePercent),
      };
    });

    const scores   = exams.map(e => e.score);
    const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const highScore = scores.length ? Math.max(...scores) : 0;
    const lowScore  = scores.length ? Math.min(...scores) : 0;

    const allStrengths  = [...new Set(
      feedbacks.flatMap(f => f.strengths  ? f.strengths.split(",").map(s => s.trim())  : []).filter(Boolean)
    )].slice(0, 4);

    const allWeaknesses = [...new Set(
      feedbacks.flatMap(f => f.weaknesses ? f.weaknesses.split(",").map(w => w.trim()) : []).filter(Boolean)
    )].slice(0, 4);

    const filename = `student_report_${studentName.replace(/\s+/g, "_")}.pdf`;
    const doc      = generatePdfDoc(res, filename);

    buildStudentReportPdf(doc, {
      studentName, className, enrollDate, today,
      avgScore, highScore, lowScore,
      examCount: exams.length,
      exams,
      strengths:  allStrengths.length  ? allStrengths  : ["Consistent participation"],
      weaknesses: allWeaknesses.length ? allWeaknesses : ["Continue reviewing core topics"],
      trend: scores,
    });

    doc.end();

  } catch (err) {
    console.error("Student report error:", err);
    if (!res.headersSent) res.status(500).json({ error: err.message });
  }
};

module.exports = { generateExamReport, generateStudentReport };
