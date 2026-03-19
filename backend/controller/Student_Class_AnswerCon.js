const StudentClassAnswer = require("../model/Student_Class_Answer");
const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");

// CREATE
const createAnswer = async (req, res) => {
    try {
        const answer = await StudentClassAnswer.create(req.body);
        res.json(answer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET ALL
const getAnswers = async (req, res) => {
    try {
        const answers = await StudentClassAnswer.find()
            .populate("exam")
            .populate("studentClass");
        res.json(answers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET ONE
const getAnswerById = async (req, res) => {
    try {
        const answer = await StudentClassAnswer.findById(req.params.id)
            .populate("exam")
            .populate("studentClass");
        res.json(answer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE
const updateAnswer = async (req, res) => {
    try {
        const answer = await StudentClassAnswer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(answer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE
const deleteAnswer = async (req, res) => {
    try {
        await StudentClassAnswer.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPLOAD STUDENT ANSWER
const uploadStudentAnswer = async (req, res) => {
    const { examId, studentClassId } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
    }

    try {
        const results = [];
        for (const file of files) {
            const resCloud = await cloudinary.uploader.upload(file.path, {
                folder: "student_answers",
            });
            results.push({
                url: resCloud.secure_url,
                public_id: resCloud.public_id,
            });
            fs.unlinkSync(file.path);
        }

        const answer = await StudentClassAnswer.create({
            exam: examId,
            studentClass: studentClassId,
            answers: results,
            submittedAt: new Date()
        });

        res.json(answer);
    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ error: err.message });
    }
};

// GET MY ANSWERS FOR A CLASS (with graded flag)
const getMyAnswersForClass = async (req, res) => {
    try {
        const StudentClass = require("../model/Student_Class");
        const Student = require("../model/Student");
        const Feedback = require("../model/Feedback");

        const student = await Student.findOne({ user: req.user._id });
        if (!student) return res.status(404).json({ error: "Student profile not found" });

        const sc = await StudentClass.findOne({ student: student._id, class: req.params.classId });
        if (!sc) return res.status(404).json({ error: "Enrollment not found" });

        const answers = await StudentClassAnswer.find({ studentClass: sc._id })
            .populate("exam");

        const answerIds = answers.map(a => a._id);
        const feedbacks = await Feedback.find({ studentClassAnswer: { $in: answerIds } });

        const result = answers.map(ans => {
            const isGraded = feedbacks.some(fb =>
                fb.studentClassAnswer?.toString() === ans._id.toString()
            );
            return {
                _id: ans._id,
                examId: ans.exam?._id?.toString() || ans.exam?.toString(),
                answers: ans.answers || [],
                submittedAt: ans.submittedAt,
                isGraded
            };
        });

        res.json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE MY ANSWER (only if not graded; also removes Cloudinary files)
const deleteMyAnswer = async (req, res) => {
    try {
        const Feedback = require("../model/Feedback");
        const Student = require("../model/Student");
        const StudentClass = require("../model/Student_Class");

        const student = await Student.findOne({ user: req.user._id });
        if (!student) return res.status(404).json({ error: "Student profile not found" });

        const answer = await StudentClassAnswer.findById(req.params.id).populate("studentClass");
        if (!answer) return res.status(404).json({ error: "Answer not found" });

        // Verify ownership
        const sc = await StudentClass.findOne({ _id: answer.studentClass, student: student._id });
        if (!sc) return res.status(403).json({ error: "Not authorized to delete this answer" });

        // Check if already graded
        const feedback = await Feedback.findOne({ studentClassAnswer: answer._id });
        if (feedback) {
            return res.status(403).json({ error: "Cannot delete a graded submission." });
        }

        // Delete Cloudinary files
        for (const file of (answer.answers || [])) {
            if (file.public_id) {
                await cloudinary.uploader.destroy(file.public_id).catch(() => {});
            }
        }

        await StudentClassAnswer.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Answer deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET ALL ANSWERS FOR A CLASS (TEACHER VIEW)
const getAnswersForTeacher = async (req, res) => {
    try {
        const StudentClass = require("../model/Student_Class");
        const Student = require("../model/Student");
        const User = require("../model/User");
        const Feedback = require("../model/Feedback");

        const { classId } = req.params;

        // Find all enrollments for this class
        const enrollments = await StudentClass.find({ class: classId }).populate('student');
        const enrollmentIds = enrollments.map(e => e._id);

        // Find all answers for these enrollments
        const answers = await StudentClassAnswer.find({ studentClass: { $in: enrollmentIds } })
            .populate("exam")
            .populate({
                path: 'studentClass',
                populate: {
                    path: 'student',
                    populate: {
                        path: 'user'
                    }
                }
            });

        const answerIds = answers.map(a => a._id);
        const feedbacks = await Feedback.find({ studentClassAnswer: { $in: answerIds } });

        const result = answers.map(ans => {
            const isGraded = feedbacks.some(fb =>
                fb.studentClassAnswer?.toString() === ans._id.toString()
            );
            
            // Extract student info gracefully
            let studentName = "Unknown Student";
            let studentEmail = "";
            let avatar = "";
            if (ans.studentClass && ans.studentClass.student && ans.studentClass.student.user) {
                const u = ans.studentClass.student.user;
                studentName = `${u.firstName || ''} ${u.lastName || ''}`.trim();
                studentEmail = u.email;
                avatar = u.firstName ? `${u.firstName[0]}${u.lastName ? u.lastName[0] : ''}` : '?';
            }

            return {
                _id: ans._id,
                examId: ans.exam?._id?.toString() || ans.exam?.toString(),
                answers: ans.answers || [],
                submittedAt: ans.submittedAt,
                isGraded,
                student: {
                    name: studentName,
                    email: studentEmail,
                    avatar: avatar
                }
            };
        });

        res.json({ success: true, data: result });
    } catch (err) {
        console.error("Error in getAnswersForTeacher:", err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createAnswer,
    getAnswers,
    getAnswerById,
    updateAnswer,
    deleteAnswer,
    uploadStudentAnswer,
    getMyAnswersForClass,
    deleteMyAnswer,
    getAnswersForTeacher
};
