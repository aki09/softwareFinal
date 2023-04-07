const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const Drone = require("../models/drone");
const otpGenerator = require("otp-generator");
const createTokens = require("../middleware/usercreatetoken");
const Otp = require("../models/otp");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

exports.postLogin = (req, res, next) => {
  const userName = req.body.username;
  const password = req.body.password;
  User.findOne({ userName: userName })
    .then((user) => {
      if (!user) {
        return res.status(400).send({ message: "No such user exists" });
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            const accessToken = createTokens(user);
            res
              .status(200)
              .send({ access: accessToken, message: "Logged in successfully" });
          } else {
            res.status(401).send({ message: "Wrong password" });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({ message: "Internal server error" });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: "Internal server error" });
    });
};

exports.postSignup = async (req, res) => {
  const { username, email, password, company} = req.body;

  try {

    const userExists = await User.findOne({ userName: username});
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      userName:username,
      email,
      password: hashedPassword,
      company,
    });

    const newUser = await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.gmailuser,
        pass: process.env.gmailpass,
      },
    });

    const mailOptions = {
      from: process.env.gmailuser,
      to: email,
      subject: `Welcome to Flynovate ${company}`,
      html: "<h1>You successfully signed up!</h1>",
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send({ message: "Registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.gmailuser,
    pass: process.env.gmailpass,
  },
});

exports.sendotp = async(req, res) => {
  const { email, username } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  const userExists = await User.findOne({ userName:username });
    if (userExists) {
      return res.status(400).json({ error: "Username already exists. Enter a new one" });
    }
    let otpty = await Otp.findOne({ email:email });
    if (otpty) {
      await otpty.deleteOne();
    }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const mailOptions = {
    from: process.env.gmailuser,
    to: email,
    subject: `Welcome to Flynovate`,
    text: `Your OTP is ${otp}. This OTP will expire in 5 minutes.`,
  };
  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      return res.status(500).json({ error: "Error sending OTP" });
    }

    const newOtp = new Otp({
      email,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    })
    try {
      await newOtp.save();
      res.json({ message: "OTP sent successfully" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Error saving OTP" });
    }
  });
};

exports.resendotp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  try {
    let otp = await Otp.findOne({ email:email });
  
    if (!otp) {
      const newOtp =  Math.floor(100000 + Math.random() * 900000).toString();
      const newExpiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
      const newOtpObj = new Otp({ email, otp: newOtp, expiresAt: newExpiresAt });
      try {
        await newOtpObj.save();
        const mailOptions = {
          from: process.env.gmailuser,
          to: email,
          subject: `Welcome to Flynovate`,
          text: `Your new OTP is ${newOtp}. This OTP will expire in 5 minutes.`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return res.status(500).json({ error: "Error resending OTP" });
          }
          res.json({ message: "New OTP sent successfully" });
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Error resending OTP" });
      }
    }
    if (Date.now() > otp.expiresAt) {
      await otp.deleteOne();
      const newOtp =  Math.floor(100000 + Math.random() * 900000).toString();
      const newExpiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
      const newOtpObj = new Otp({ email, otp: newOtp, expiresAt: newExpiresAt });
      try {
        await newOtpObj.save();
        const mailOptions = {
          from: process.env.gmailuser,
          to: email,
          subject: `Welcome to Flynovate`,
          text: `Your new OTP is ${newOtp}. This OTP will expire in 5 minutes.`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return res.status(500).json({ error: "Error resending OTP" });
          }
          res.json({ message: "New OTP sent successfully" });
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Error resending OTP" });
      }
    }else{ 
      const mailOptions = {
        from: process.env.gmailuser,
        to: email,
        subject: `Welcome to Flynovate`,
        text: `Your OTP is ${otp.otp}. This OTP will expire in 5 minutes.`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ error: "Error sending OTP" });
        }
        res.json({ message: "OTP resent successfully" });
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Error resending OTP" });
  }
};

exports.verifyotp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const otpDoc = await Otp.findOne({ email:email });
    if (!otpDoc) {
      return res.status(400).json({ error: "No OTP sent to this email" });
    }
    if (Date.now() > otpDoc.expiresAt) {
      return res
        .status(400)
        .json({ error: "OTP expired, please request a new one" });
    }

    if (otpDoc.otp !== otp) {
      return res.status(400).json({ error: "OTP is invalid" });
    }else{
      await otpDoc.remove();
      res.status(200).json({ message: "OTP is verified successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error, please try again" });
  }
};
