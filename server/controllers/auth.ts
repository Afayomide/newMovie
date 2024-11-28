const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
import User from "../models/user";
require("dotenv").config();
import crypto from "crypto";
import { Request, Response } from "express";

const sameSiteValue: "lax" | "strict" | "none" | undefined =
  process.env.SAME_SITE === "lax" ||
  process.env.SAME_SITE === "strict" ||
  process.env.SAME_SITE === "none"
    ? process.env.SAME_SITE
    : undefined;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const checkAuth = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.userId).select("-password"); // Exclude password field
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  console.log(req.cookies);
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
    }
    if (user.verified == false) {
      return res.json({ message: "user sign up not completed" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "4d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: sameSiteValue,
      maxAge: 4 * 24 * 60 * 60 * 1000,
    });
    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, userWithoutPassword });
    console.log(user._id);
  } catch (error: any) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const signUp = async (req: Request, res: Response) => {
  function generateSignupToken() {
    return Math.floor(
      100000 + (crypto.randomBytes(3).readUIntBE(0, 3) % 900000)
    ).toString();
  }
  let signupToken = generateSignupToken();

  const { fullname, username, email, password } = req.body;

  if (!username || !password || !username || !email) {
    return res.json({ success: false, message: "All fields are required" });
  }
  console.log(process.env.EMAIL_USER, email);
  try {
    const existingEmail = await User.findOne({ email });
    const existingUser = await User.findOne({ username });

    if (existingEmail) {
      return res.json({ success: false, message: "Email already exists" });
    }
    if (existingUser) {
      return res.json({ success: false, message: "Username already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const newUser = new User({
      fullname,
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      token: signupToken,
      tokenExpires: new Date(Date.now() + 6 * 60 * 60 * 1000),
      status: "incomplete signup",
    });

    const signupURL = `${process.env.CLIENT_URL}/verify?token=${signupToken}`;
    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: "Sign Up Request",
      // text: `You are receiving this email because you have requested a password reset for your account.\n\n
      //        Please click on the following link, or paste it into your browser, to complete the process:\n\n
      //        ${resetURL}\n\n
      //        If you did not request this, please ignore this email and your password will remain unchanged.`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; padding: 20px;">
          <h2>Sign Up Request</h2>
          <p>You are receiving this email to complete your signup process at Movies App.</p>
          <p>
            <a href="${signupURL}" style="background-color: #ffaa00; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Complete Signup</a>
          </p>
          <p>Or copy and paste this link into your browser: <a href="${signupURL}">${signupURL}</a></p>
          <p><strong>Thank you!</strong></p>
          <img src="cid:logoImage" alt="Company Logo" width="100" height:auto;>
        </div>
      `,
      // attachments: [
      //   {
      //     filename: "logo.png",
      //     path: "../assets/logo.png",
      //     cid: "logoImage",
      //   },
      // ],
    };
    const savedUser = await newUser.save();
    if (!savedUser) {
      return res
        .status(400)
        .json({ success: false, message: "an error occurred" });
    }
    await transporter.sendMail(mailOptions);
    return res.json({
      success: true,
      message: "Email sent, signup incomplete",
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    return res.json({ success: false, message: "Internal server error" });
  }
};

export const completeSignup = async (req: Request, res: Response) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({
      token: token,
      tokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired." });
    }
    user.verified = true;
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "signup completed." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const logOut = (req: Request, res: Response) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set to true in production for HTTPS
    // sameSite: sameSiteValue,
    maxAge: 0,
  });

  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
};