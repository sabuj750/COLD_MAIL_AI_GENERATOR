import User from "../models/User.js";
import sendOtpEmail from "../utils/sendOtpEmail.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }
    // for a valid email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    let user = await User.findOne({ email });
    if (user?.isVerified) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // otp valid for 5 minutes

    const isNewUser = !user;
    if (user) {
      user.name = name;
      user.password = password;
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
    } else {
      user = await User.create({ name, email, password, otp, otpExpiry });
    }
    try {
      await sendOtpEmail({
        to: email,
        subject: "Your OTP code from AI Cold Mail Generator",
        text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
      });
    } catch (err) {
      console.error("Error sending OTP email:", err.message);
      return res.status(502).json({
        message: "Could not send the verification email. Please try again.",
      });
    }

    return res.status(isNewUser ? 201 : 200).json({
      message: isNewUser
        ? "User registered successfully"
        : "A new verification code has been sent",
      user: { name: user.name, email: user.email, userId: user._id },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error registering user",
      error: err,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }
    // for a valid email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email" });
    }

    const user = await User.findOne({ email }).select("+password +isVerified");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (!user.isVerified) {
      return res.status(400).json({ message: "User not verified" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    return res
      .status(200)
      .json({
        message: "User logged in successfully",
        token,
        user: { name: user.name, email: user.email },
      });
  } catch (err) {
    return res.status(500).json({
      message: "Error logging in user",
      error: err,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Please provide email and otp" });
    }
    const user = await User.findOne({ email }).select("+otp +otpExpiry");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    // generate jwt token
    const token = generateToken(user._id);
    return res
      .status(200)
      .json({
        message: "User verified successfully",
        token,
        user: { name: user.name, email: user.email },
      });
  } catch (err) {
    return res.status(500).json({
      message: "Error verifying user",
      error: err,
    });
  }
};
