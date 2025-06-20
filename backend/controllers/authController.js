// controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");
const PendingUser = require("../models/PendingUser");
const sendVerificationEmail = require("../utils/sendMail");

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "Email already registered." });

    const token = crypto.randomBytes(32).toString("hex");
    const hashedPassword = await bcrypt.hash(password, 10);

    await PendingUser.findOneAndDelete({ email }); // delete old attempts

    const pendingUser = new PendingUser({ name, email, password: hashedPassword, role, token });
    await pendingUser.save();

    const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${token}&email=${email}`;
    await sendVerificationEmail(email, verifyLink);

    res.status(200).json({ msg: "Verification email sent. Check your inbox." });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token, email } = req.query;
  try {
    const pending = await PendingUser.findOne({ email, token });
    if (!pending) return res.status(400).json({ msg: "Invalid or expired verification link." });

    const newUser = new User({
      name: pending.name,
      email: pending.email,
      password: pending.password,
      role: pending.role,
    });

    await newUser.save();
    await PendingUser.deleteOne({ email });

    res.status(200).json({ msg: "Email verified successfully. You can now login." });
  } catch (err) {
    res.status(500).json({ msg: "Verification failed", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      token,
      role: user.role,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ msg: "Login error", error: err.message });
  }
};
