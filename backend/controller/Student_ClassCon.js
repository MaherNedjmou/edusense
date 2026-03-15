const Feedback = require("../model/Feedback");
const StudentClassAnswer = require("../model/Student_Class_Answer");
const Exam = require("../model/Exam");
const StudentClass = require("../model/Student_Class");

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

module.exports = {
    createStudentClass,
    getStudentClasses,
    getStudentClassById,
    updateStudentClass,
    deleteStudentClass,
    getStudentClassesStats
};
