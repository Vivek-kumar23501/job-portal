// utils/sendMail.js
const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, verifyLink) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Job Portal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "✅ Verify your email - Job Portal",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
            <h2 style="color: #0077cc;">Welcome to Job Portal!</h2>
            <p style="font-size: 16px; color: #333;">Hi there,</p>
            <p style="font-size: 15px; color: #333;">
              Thank you for registering on <strong>Job Portal</strong>. To complete your registration, please verify your email by clicking the button below:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verifyLink}" style="background-color: #28a745; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Verify Email</a>
            </div>
            <p style="font-size: 14px; color: #777;">This link will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
            <hr style="margin: 30px 0;">
            <p style="font-size: 13px; color: #aaa; text-align: center;">© ${new Date().getFullYear()} Job Portal. All rights reserved.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Error sending mail:", err);
  }
};

module.exports = sendVerificationEmail;
