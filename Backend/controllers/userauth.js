const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const User = require("../models/user");
const Drone = require('../models/drone');
const otpGenerator = require('otp-generator');
const createTokens  = require("../middleware/usercreatetoken");
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();
const redis = require('redis');


exports.postLogin = (req, res, next) => {
    const userName = req.body.username;
    const password = req.body.password;
    User.findOne({ userName: userName })
      .then((user) => {
        if (!user) {
          return res.status(400).send({ message: "No such user exists" });
        }
        bcrypt.compare(password, user.password)
          .then((doMatch) => {
            if (doMatch) {
              const accessToken = createTokens(user);
              res.status(200).send({ access: accessToken, message: "Logged in successfully" });
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

exports.postSignup = (req, res, next) => {
    const userName = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const company = req.body.company;
    const confirmPassword = req.body.confirmPassword;
    if (password == confirmPassword) {
        User.findOne({ userName: userName })
            .then((userDoc) => {
                if (userDoc) {
                    return res.redirect("/signup");
                }
                return bcrypt
                    .hash(password, 12)
                    .then((hashedPassword) => {
                        const user = new User({
                            userName: userName,
                            password: hashedPassword,
                            company: company,
                            email: email,
                        });
                        return user.save();
                    })
                    .then((result) => {
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: process.env.gmailuser,
                                pass: process.env.gmailpass
                            }
                        })
                    
                        const mailOptions = {
                            from: process.env.gmailuser,
                            to: email,
                            subject: `Welcome to Flynovate ${company}`,
                            html: '<h1>You successfully signed up!</h1>'
                        }
                    
                        transporter.sendMail(mailOptions)
                        res.status(200).send({ message: "logged in successfully" });
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        console.log("diff");
        return res.redirect("/signup");
    }
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.gmailuser,
      pass: process.env.gmailpass
  }
});

let otpSent = {}; 

exports.sendotp=(req,res)=>{
    const email = req.body.email;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    const mailOptions = {
      from: process.env.gmailuser,
      to: email,
      subject: `Welcome to Flynovate`,
      text: `Your OTP is ${otp}. This OTP will expire in 5 minutes.`,
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: 'Error sending OTP' });
    }

    otpSent[email] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    };

    res.json({ message: 'OTP sent successfully' });
  });
};

exports.resendotp=(req,res)=>{
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (!otpSent[email]) {
    return res.status(400).json({ error: 'No OTP sent to this email' });
  }
  const { otp, expiresAt } = otpSent[email];
  if (Date.now() > expiresAt) {
    return res.status(400).json({ error: 'OTP expired, please request a new one' });
  }
  const mailOptions = {
    from: process.env.gmailuser,
    to: email,
    subject: `Welcome to Flynovate`,
    text: `Your OTP is ${otp}. This OTP will expire in 5 minutes.`,
  
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Error sending OTP' });
    }

    otpSent[email] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    };

    console.log(otpSent)

    res.json({ message: 'OTP resend successfully' });
  });
};

exports.verifyotp=(req,res)=>{
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }
  if (!otpSent[email]) {
    console.log(otpSent);
    return res.status(400).json({ error: 'No OTP sent to this email' });
  }
  const { sentOtp, expiresAt } = otpSent[email];

  if (Date.now() > expiresAt) {
    return res.status(400).json({ error: 'OTP expired, please request a new one' });
  }
  if (sentOtp !== otp) {
    return res.status(400).json({ error: 'OTP is invalid' });
  }
  delete otpSent[email];
  res.status(200).json({ message: 'OTP is verified successfully' });
}