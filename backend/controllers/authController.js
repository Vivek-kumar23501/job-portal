const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");
const PendingUser = require("../models/PendingUser");
const sendVerificationEmail = require("../utils/sendMail");


// Register & Send Verification Email
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email is already registered." });
    }

    await PendingUser.findOneAndDelete({ email }); // delete previous pending attempts

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString("hex");

    const pendingUser = new PendingUser({ name, email, password: hashedPassword, role, token });
    await pendingUser.save();

    const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${token}&email=${email}`;
    await sendVerificationEmail(email, verifyLink);

    return res.status(200).json({ msg: "Verification email sent. Please check your inbox." });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ msg: "Server error. Please try again.", error: err.message });
  }
};

// Verify Email and Finalize Registration
exports.verifyEmail = async (req, res) => {
  const { token, email } = req.query;
  try {
    const pending = await PendingUser.findOne({ email, token });
    if (!pending) {
      return res.status(400).json({ msg: "Invalid or expired verification link." });
    }

    const newUser = new User({
      name: pending.name,
      email: pending.email,
      password: pending.password,
      role: pending.role,
    });

    await newUser.save();
    await PendingUser.deleteOne({ email });

    return res.status(200).json({ msg: "Email verified successfully. You can now log in." });
  } catch (err) {
    console.error("Verification Error:", err);
    return res.status(500).json({ msg: "Email verification failed", error: err.message });
  }
};

// Login and Issue Token
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      token,
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ msg: "Login error", error: err.message });
  }
};
