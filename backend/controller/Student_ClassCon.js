const Feedback = require("../model/Feedback");
const StudentClassAnswer = require("../model/Student_Class_Answer");
const Exam = require("../model/Exam");
const StudentClass = require("../model/Student_Class");
const Student = require("../model/Student");
const Class = require("../model/Class");

// CREATE
const createStudentClass = async (req, res) => {
    try {
        const sc = await StudentClass.create(req.body);
        res.json(sc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET ALL
const getStudentClasses = async (req, res) => {
    try {
        const scList = await StudentClass.find()
            .populate("student")
            .populate("class");
        res.json(scList);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET ONE
const getStudentClassById = async (req, res) => {
    try {
        console.log(req.params.id);
        const sc = await StudentClass.find({ class: req.params.id })
            .populate({
                path: "student",
                populate: {
                    path: "user"
                }
            })
            .populate("class");
        res.json(sc);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

// UPDATE
const updateStudentClass = async (req, res) => {
    try {
        const sc = await StudentClass.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(sc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE
const deleteStudentClass = async (req, res) => {
    try {
        await StudentClass.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET STATS FOR ALL STUDENTS IN A CLASS
const getStudentClassesStats = async (req, res) => {
    try {
        const classId = req.params.classId;
        const scList = await StudentClass.find({ class: classId })
            .populate({
                path: "student",
                populate: { path: "user" }
            });

        const exams = await Exam.find({ class: classId }).sort({ createdAt: 1 });
        const examIds = exams.map(e => e._id);

        const answers = await StudentClassAnswer.find({
            studentClass: { $in: scList.map(sc => sc._id) },
            exam: { $in: examIds }
        });

        const feedbacks = await Feedback.find({
            studentClassAnswer: { $in: answers.map(a => a._id) }
        });

        const studentsStats = {};

        scList.forEach(sc => {
            const user = sc.student && sc.student.user ? sc.student.user : null;
            if (!user) return;
            const studentName = user.firstName + " " + user.lastName;
            studentsStats[studentName] = {
                id: sc._id,
                exams: [],
                trend: [],
                strengths: [],
                weaknesses: []
            };
        });

        answers.forEach(ans => {
            const sc = scList.find(s => s._id.toString() === ans.studentClass.toString());
            if (!sc || !sc.student || !sc.student.user) return;
            const studentName = sc.student.user.firstName + " " + sc.student.user.lastName;
            if (!studentsStats[studentName]) return;

            const exam = exams.find(e => e._id.toString() === ans.exam.toString());
            const feedback = feedbacks.find(f => f.studentClassAnswer && f.studentClassAnswer.toString() === ans._id.toString());

            const scorePercentage = exam && exam.totalMarks ? Math.round((ans.score / exam.totalMarks) * 100) : (ans.score || 0);

            let grade = "C";
            if (scorePercentage >= 90) grade = "A";
            else if (scorePercentage >= 80) grade = "B";
            else if (scorePercentage >= 70) grade = "C";
            else if (scorePercentage >= 60) grade = "D";
            else grade = "F";

            const examDate = exam && exam.createdAt ? exam.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Unknown Date";

            studentsStats[studentName].exams.push({
                title: exam ? exam.title : "Unknown Exam",
                date: examDate,
                grade: grade,
                score: scorePercentage,
                feedback: feedback ? (feedback.recommendation || feedback.keyinsights || "Good work.") : "No feedback provided",
                answers: ans.answers || [],
                timestamp: exam ? exam.createdAt : new Date(0)
            });

            studentsStats[studentName].trend.push({ score: scorePercentage, timestamp: exam ? exam.createdAt : new Date(0) });

            if (feedback) {
                if (feedback.strengths) {
                    studentsStats[studentName].strengths.push(...feedback.strengths.split(',').map(s => s.trim()));
                }
                if (feedback.weaknesses) {
                    studentsStats[studentName].weaknesses.push(...feedback.weaknesses.split(',').map(s => s.trim()));
                }
            }
        });

        for (const [name, stat] of Object.entries(studentsStats)) {
            stat.exams.sort((a, b) => b.timestamp - a.timestamp);
            stat.trend.sort((a, b) => a.timestamp - b.timestamp);
            stat.trend = stat.trend.map(t => t.score);
            stat.strengths = [...new Set(stat.strengths)].filter(Boolean).slice(0, 3);
            stat.weaknesses = [...new Set(stat.weaknesses)].filter(Boolean).slice(0, 3);

            if (stat.strengths.length === 0) stat.strengths = ["Problem Solving"];
            if (stat.weaknesses.length === 0) stat.weaknesses = ["Time Management"];
        }

        res.json(studentsStats);
    } catch (err) {
        console.log("Error in stats:", err);
        res.status(500).json({ error: err.message });
    }
};

// GET CLASSES ENROLLED BY THE LOGGED-IN STUDENT
const getMyClasses = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user._id });
        if (!student) return res.status(404).json({ error: "Student profile not found" });

        const scList = await StudentClass.find({ student: student._id })
            .populate({
                path: "class",
                populate: { path: "teacher" }
            })
            .lean();

        let classes = scList.map(sc => sc.class).filter(Boolean);
        
        classes = await Promise.all(classes.map(async (cls) => {
            const studentCount = await StudentClass.countDocuments({ class: cls._id });
            const sectionCount = await Exam.countDocuments({ class: cls._id });
            return { ...cls, studentCount, sectionCount };
        }));

        res.json({ success: true, data: classes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// JOIN A CLASS BY CODE OR ID
const joinClass = async (req, res) => {
    try {
        const { code, classId } = req.body;
        if (!code && !classId) return res.status(400).json({ error: "Class code or ID is required" });

        const student = await Student.findOne({ user: req.user._id });
        if (!student) return res.status(404).json({ error: "Student profile not found" });

        let classItem;
        if (classId) {
            classItem = await Class.findById(classId);
        } else {
            classItem = await Class.findOne({ code });
        }
        
        if (!classItem) return res.status(404).json({ error: "Class not found. Check the code or ID and try again." });

        const existing = await StudentClass.findOne({ student: student._id, class: classItem._id });
        if (existing) return res.status(409).json({ error: "You are already enrolled in this class." });

        const sc = await StudentClass.create({ student: student._id, class: classItem._id });
        res.status(201).json({ success: true, data: classItem, enrollment: sc });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET THE LOGGED-IN STUDENT'S ENROLLMENT RECORD FOR A GIVEN CLASS
const getMyEnrollment = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user._id });
        if (!student) return res.status(404).json({ error: "Student profile not found" });

        const sc = await StudentClass.findOne({ student: student._id, class: req.params.classId });
        if (!sc) return res.status(404).json({ error: "Enrollment not found" });

        res.json({ success: true, data: sc });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET DASHBOARD STATS FOR THE LOGGED-IN STUDENT
const getMyDashboardStats = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user._id });
        if (!student) return res.status(404).json({ error: "Student profile not found" });

        const scList = await StudentClass.find({ student: student._id }).populate("class");
        const scIds = scList.map(sc => sc._id);

        const answers = await StudentClassAnswer.find({ studentClass: { $in: scIds } })
            .populate("exam")
            .sort({ submittedAt: -1 });

        const answerIds = answers.map(a => a._id);
        const feedbacks = await Feedback.find({ studentClassAnswer: { $in: answerIds } })
            .populate({ path: "studentClassAnswer", populate: { path: "exam" } })
            .sort({ createdAt: -1 });

        // Compute average score
        let totalScore = 0, scoredCount = 0;
        const submissionsData = [];
        answers.forEach(ans => {
            const exam = ans.exam;
            const scorePercentage = exam && exam.totalMarks
                ? Math.round((ans.score / exam.totalMarks) * 100)
                : (ans.score || 0);
            if (typeof ans.score === "number") {
                totalScore += scorePercentage;
                scoredCount++;
            }
            submissionsData.push({
                exam: exam ? exam.title : "Unknown",
                score: scorePercentage
            });
        });

        const avgScore = scoredCount > 0 ? Math.round(totalScore / scoredCount) : 0;

        // Score distribution
        let excellent = 0, good = 0, average = 0, weak = 0;
        submissionsData.forEach(({ score }) => {
            if (score >= 90) excellent++;
            else if (score >= 75) good++;
            else if (score >= 50) average++;
            else weak++;
        });

        // Recent feedbacks (last 5)
        const recentFeedbacks = feedbacks.slice(0, 5).map(fb => ({
            exam: fb.studentClassAnswer?.exam?.title || "Unknown Exam",
            feedback: fb.recommendation || fb.keyinsights || "No feedback",
            score: (() => {
                const ans = answers.find(a => a._id.toString() === fb.studentClassAnswer?._id?.toString());
                const exam = ans?.exam;
                return exam && exam.totalMarks && typeof ans.score === "number"
                    ? Math.round((ans.score / exam.totalMarks) * 100)
                    : (ans?.score || 0);
            })()
        }));

        // Recent submissions (last 5)
        const recentSubmissions = answers.slice(0, 5).map(ans => {
            const hasFeedback = feedbacks.some(fb =>
                fb.studentClassAnswer?._id?.toString() === ans._id.toString()
            );
            return {
                exam: ans.exam ? ans.exam.title : "Unknown Exam",
                status: hasFeedback ? "Analyzed" : "Processing"
            };
        });

        res.json({
            success: true,
            data: {
                stats: {
                    classCount: scList.length,
                    submissionCount: answers.length,
                    analysisCount: feedbacks.length,
                    averageScore: avgScore
                },
                submissionsData: submissionsData.slice(0, 10),
                distribution: { excellent, good, average, weak },
                recentFeedbacks,
                recentSubmissions
            }
        });
    } catch (err) {
        console.error("Dashboard stats error:", err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createStudentClass,
    getStudentClasses,
    getStudentClassById,
    updateStudentClass,
    deleteStudentClass,
    getStudentClassesStats,
    getMyClasses,
    joinClass,
    getMyEnrollment,
    getMyDashboardStats
};
