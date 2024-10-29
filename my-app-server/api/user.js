const express = require("express");
const router = express.Router();
const User = require("./../models/User");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ status: "Failed", message: "Access denied" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ status: "Failed", message: "Invalid token" });
    req.user = user;
    next();
  });
};

const sendVerificationCode = async (email, code) => {
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: "Your Email Verification Code",
    text: `Your verification code is: ${code}`,
  };
  return transporter.sendMail(mailOptions);
};

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// Collect initial details (name, email, phone) and send OTP
router.post("/signup", async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.json({ status: "Failed", message: "Please fill in all fields." });
  }

  try {
    if (await User.findOne({ email })) {
      return res.json({ status: "Failed", message: "User already exists" });
    }

    const verificationCode = generateCode();
    const newUser = new User({
      name,
      email,
      phone,
      verificationCode,
      verificationCodeExpires: Date.now() + 10 * 60 * 1000, 
    });
    await newUser.save();

    await sendVerificationCode(email, verificationCode);
    res.json({ status: "Success", message: "Verification code sent to email." });
  } catch (error) {
    console.error(error);
    res.json({ status: "Failed", message: "An error occurred during signup" });
  }
});

//  Verify OTP
router.post("/signup-step2", async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.verificationCode !== code || user.verificationCodeExpires < Date.now()) {
      return res.json({ status: "Failed", message: "Invalid or expired verification code" });
    }

    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    res.json({ status: "Success", message: "OTP verified. Proceed to set user ID and password." });
  } catch (error) {
    console.error(error);
    res.json({ status: "Failed", message: "An error occurred during OTP verification" });
  }
});

//Set user ID and password
router.post("/signup-step3", async (req, res) => {
  const { email, userId, password } = req.body;

  if (!userId || !password) {
    return res.json({ status: "Failed", message: "User ID and password are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ status: "Failed", message: "User not found." });
    }

    user.userId = userId;
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.json({ status: "Success", message: "User ID and password set successfully." });
  } catch (error) {
    console.error(error);
    res.json({ status: "Failed", message: "An error occurred while setting user ID and password." });
  }
});

//Login Route
router.post("/login" , async(req,res)=>{
  const {email, password} = req.body;

  if(!email || !password){
    return res.json({status:"Failed", message:"The input field is empty."});
  }

  try{
    const user = await User.findOne({email});
    if(!user){
      return res.json({status: "Failed" , message:"User not found."});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if(!isMatch){
      return res.json({status:"Failed" , message:"Invalid credentials"})
    }

    const token = jwt.sign({id: user._id, email: user.email}, SECRET_KEY, {expiresIn: "1h"});
    res.json({ status: "Success", message: "Login successful.", token });
  }catch (error) {
    console.error(error);
    res.json({ status: "Failed", message: "An error occurred during login." });
  }
})

module.exports = router;
