const Teacher = require("../model/Teacher");


// CREATE TEACHER
const createTeacher = async (req, res) => {
  try {

    const teacher = await Teacher.create(req.body);

    res.status(201).json({
      success: true,
      data: teacher
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
};



// GET ALL TEACHERS
const getTeachers = async (req, res) => {
  try {

    const teachers = await Teacher.find().populate("user");

    res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



// GET ONE TEACHER
const getTeacherById = async (req, res) => {
  console.log("DEBUG: getTeacherById called with ID:", req.params.id);
  try {

    const teacher = await Teacher
      .findById(req.params.id)
      .populate("user");

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found"
      });
    }

    res.status(200).json({
      success: true,
      data: teacher
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



// UPDATE TEACHER
const updateTeacher = async (req, res) => {
  try {

    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found"
      });
    }

    res.status(200).json({
      success: true,
      data: teacher
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
};



// DELETE TEACHER
const deleteTeacher = async (req, res) => {
  try {

    const teacher = await Teacher.findByIdAndDelete(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Teacher deleted"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



// GET TEACHER DASHBOARD STATS
const getDashboardStats = async (req, res) => {
  try {
    const Teacher = require("../model/Teacher");
    const Class = require("../model/Class");
    const StudentClass = require("../model/Student_Class");
    const Exam = require("../model/Exam");

    // Find the teacher profile for this user
    let teacher = await Teacher.findOne({ user: req.user._id });
    
    // If no teacher profile but user is teacher, create one
    if (!teacher && req.user.role === "teacher") {
      teacher = await Teacher.create({ user: req.user._id });
    }

    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher profile not found" });
    }

    const classes = await Class.find({ teacher: teacher._id });
    const classIds = classes.map(c => c._id);

    const studentsEnrolled = await StudentClass.countDocuments({ class: { $in: classIds } });
    const sectionsCount = await Exam.countDocuments({ class: { $in: classIds } });

    // Mock analysis count for now or fetch from StudentClassAnswer
    const StudentClassAnswer = require("../model/Student_Class_Answer");
    const analysisCount = await StudentClassAnswer.countDocuments({ 
      exam: { $in: await Exam.find({ class: { $in: classIds } }).distinct("_id") } 
    });

    res.status(200).json({
      success: true,
      data: {
        classesCount: classes.length,
        studentsCount: studentsEnrolled,
        sectionsCount: sectionsCount,
        analysisCount: analysisCount
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// GET TEACHER ANALYTICS (Charts & Stats)
const getTeacherAnalytics = async (req, res) => {
  console.log("DEBUG: getTeacherAnalytics called");
  try {
    const Teacher = require("../model/Teacher");
    const Class = require("../model/Class");
    const Exam = require("../model/Exam");
    const StudentClassAnswer = require("../model/Student_Class_Answer");
    const Feedback = require("../model/Feedback");

    let teacher = await Teacher.findOne({ user: req.user._id });
    if (!teacher && req.user.role === "teacher") {
      teacher = await Teacher.create({ user: req.user._id });
    }

    if (!teacher) {
      return res.status(200).json({ success: true, data: [] });
    }

    // 1. Get all classes
    const classes = await Class.find({ teacher: teacher._id }).lean();
    console.log(`Found ${classes.length} classes for teacher ${teacher._id}`);
    
    // 2. Compute analytics per class
    const analytics = await Promise.all(classes.map(async (cls) => {
      // Find exams for this class
      const exams = await Exam.find({ class: cls._id }).select('_id title').lean();
      const examIds = exams.map(e => e._id);

      // Find all answers (submissions) for these exams
      const answers = await StudentClassAnswer.find({ exam: { $in: examIds } })
        .populate({
          path: 'studentClass',
          populate: {
            path: 'student',
            populate: { path: 'user' }
          }
        })
        .populate('exam', 'title')
        .lean();

      // Find all feedback for these answers
      const answerIds = answers.map(a => a._id);
      const feedbacks = await Feedback.find({ studentClassAnswer: { $in: answerIds } }).lean();

      // Map feedback scores to answers
      const processedAnswers = answers.map(ans => {
        const fb = feedbacks.find(f => f.studentClassAnswer?.toString() === ans._id?.toString());
        
        let studentName = 'Unknown Student';
        if (ans.studentClass && ans.studentClass.student && ans.studentClass.student.user) {
          studentName = `${ans.studentClass.student.user.firstName || ''} ${ans.studentClass.student.user.lastName || ''}`.trim();
          if (!studentName) studentName = ans.studentClass.student.user.email || 'No Name';
        } else if (ans.studentClass && ans.studentClass.student && ans.studentClass.student.name) {
          studentName = ans.studentClass.student.name;
        }

        return {
          id: ans._id,
          studentName,
          examTitle: ans.exam ? ans.exam.title : 'Unknown Exam',
          score: fb ? (fb.rating || 0) : (ans.score || 0),
          status: fb ? 'Processed' : 'Not Processed',
          submittedAt: ans.submittedAt
        };
      });

      // Calculate pass/fail (threshold 50)
      let passCount = 0;
      let failCount = 0;
      let distribution = {
        '0-50': 0,
        '50-70': 0,
        '70-85': 0,
        '85-100': 0
      };

      processedAnswers.forEach(ans => {
        if (ans.status === 'Processed') {
          if (ans.score >= 50) passCount++;
          else failCount++;

          if (ans.score < 50) distribution['0-50']++;
          else if (ans.score < 70) distribution['50-70']++;
          else if (ans.score < 85) distribution['70-85']++;
          else distribution['85-100']++;
        }
      });

      // Sort to find top and bottom performers
      const sortedByScore = [...processedAnswers].filter(a => a.status === 'Processed').sort((a, b) => b.score - a.score);
      const topStudents = sortedByScore.slice(0, 5);
      const lowestStudents = sortedByScore.slice(-5).reverse(); // lowest first

      // Submissions over time (Average score per exam)
      const examAverages = exams.map(exam => {
        const examAnswers = processedAnswers.filter(ans => 
          ans.examTitle === exam.title && ans.status === 'Processed'
        );
        const avg = examAnswers.length > 0 
          ? examAnswers.reduce((sum, ans) => sum + ans.score, 0) / examAnswers.length 
          : 0;
        
        return {
          exam: exam.title,
          score: Math.round(avg)
        };
      }).filter(e => e.score > 0 || processedAnswers.some(ans => ans.examTitle === e.exam));


      const processedCount = processedAnswers.filter(a => a.status === 'Processed').length;
      const totalScore = processedAnswers.reduce((sum, ans) => sum + (ans.status === 'Processed' ? ans.score : 0), 0);
      const averageScore = processedCount > 0 ? totalScore / processedCount : 0;

      return {
        classId: cls._id,
        className: cls.name,
        averageScore: Math.round(averageScore),
        passFail: {
          pass: passCount,
          fail: failCount
        },
        distribution: Object.values(distribution), // Array: [0-50, 50-70, 70-85, 85-100]
        submissions: examAverages,
        topStudents,
        lowestStudents,
        recentAnalyses: processedAnswers.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)).slice(0, 10)
      };
    }));

    res.status(200).json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getTeacherAnalytics,
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher
};
