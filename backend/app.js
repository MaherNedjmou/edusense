const connectDB = require("./config/db");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON body

// Routes
const JWT = require("./middleware/JWT");   
const authRoutes = require("./router/authRouter");  
const userRoutes = require("./router/UserRoute");
const cloudinaryController = require("./router/cloudinaryRouter");
const teacherRoutes = require("./router/TeacherRoute");
const studentRoutes = require("./router/StudentRoute");
const classRoutes = require("./router/ClassRoute");
const subscribeRoutes = require("./router/SubscribeRoute");
const studentClassRoutes = require("./router/Student_ClassRoute");
const studentClassAnswerRoutes = require("./router/Student_Class_AnswerRoute");
const feedbackRoutes = require("./router/FeedbackRoute");
const examRoutes = require("./router/examRouter");

// ########################### JUST FOR TESTING ###########################
app.use("/cloudinary", cloudinaryController);
app.use("/student-class-answers", studentClassAnswerRoutes);
// ########################################################################

// Auth routes
app.use("/auth", authRoutes);



app.use(JWT.protect);

// Use routes
app.use("/users", userRoutes);
app.use("/teachers", teacherRoutes);
app.use("/students", studentRoutes);
app.use("/classes", classRoutes);
app.use("/subscribe-plans", subscribeRoutes);
app.use("/student-classes", studentClassRoutes);
// app.use("/student-class-answers", studentClassAnswerRoutes);
app.use("/feedbacks", feedbackRoutes);
app.use("/exams", examRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
