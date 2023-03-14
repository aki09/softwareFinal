const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const User = require("../models/user");
const Drone = require('../models/drone');
const createTokens  = require("../middleware/usercreatetoken");
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();


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
