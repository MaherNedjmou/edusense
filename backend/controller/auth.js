const User = require("../model/User");
const Otp = require("../model/Otp");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

// JWT token generator
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// REQUEST SIGNUP OTP
const requestSignupOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save OTP in DB
    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Signup OTP",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });

    res.json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CONFIRM SIGNUP OTP & CREATE USER
const confirmSignupOtp = async (req, res) => {
  const { email, otp, password, role, firstName, lastName } = req.body;

  try {
    const record = await Otp.findOne({ email });

    if (!record)
      return res.status(400).json({ message: "OTP not requested" });

    if (record.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (record.expiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });

    // Create user
    const user = await User.create({ email, password, role, firstName, lastName });

    // Remove OTP record
    await Otp.deleteOne({ email });

    res.status(201).json({
      success: true,
      token: generateToken(user),
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SIGNIN
const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    res.json({
      success: true,
      token: generateToken(user),
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { requestSignupOtp, confirmSignupOtp, signin };
