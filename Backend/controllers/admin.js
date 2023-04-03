const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Drone = require("../models/drone");
const createTokens = require("../middleware/admincreatetoken");
const jlol = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();

exports.getHome = async (req, res, next) => {
  const token = req.query.cookieValue;
  if (!token) {
    return res.status(401).send("Authentication token missing");
  }
  try{
    const data = jlol.verify(token, process.env.adminsecret);
    uid = data.id;
    let admin = await Admin.findOne({ _id: uid });
    let drones = await Drone.find();
    let users = await User.find();
    res
      .status(200)
      .send({ admin: admin, drones: drones, users: users, message: "success" });
  }catch (error) {
    res.status(401).send("Invalid authentication token");
  }
};

exports.removeuser = async (req, res, next) => {
  const drone_id = req.query.droneid;
  Drone.findById(drone_id).then((drone) => {
    drone.userId = null;
    drone.save().then((result) => {});
  });
  res.status(200).send({ message: "Deallocated Successful" });
};

exports.adduser = async (req, res, next) => {
  const token = req.query.cookieValue;
  if (!token) {
    return res.status(401).send("Authentication token missing");
  }
  try{
    const drone_id = req.query.droneid;
    const data = jlol.verify(token, process.env.adminsecret);
    uid = data.id;
    let admin = await Admin.findOne({ _id: uid });
    let drone = await Drone.findById(drone_id);
    let users = await User.find();
    res.status(200).send({ drone: drone, users: users, message: "success" });
  }catch (error) {
    res.status(401).send("Invalid authentication token");
  }
};

exports.allotdrone = async (req, res, next) => {
  const userid = req.query.userid;
  const drone_id = req.query.droneid;
  Drone.findById(drone_id).then((drone) => {
    drone.userId = userid;
    drone.save().then((result) => {});
  });
  res.status(200).send({ message: "success" });
};

exports.postLogin = (req, res, next) => {
  const userName = req.body.username;
  const password = req.body.password;
  Admin.findOne({ userName: userName })
    .then((admin) => {
      if (!admin) {
        return res.status(400).send({ message: "No such admin exists" });
      }
      bcrypt
        .compare(password, admin.password)
        .then((doMatch) => {
          if (doMatch) {
            const accessToken = createTokens(admin);
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

exports.postSignup = (req, res, next) => {
  const userName = req.body.username;
  const name = req.body.name;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  if (password == confirmPassword) {
    Admin.findOne({ userName: userName })
      .then((userDoc) => {
        if (userDoc) {
          console.log("Admin already exists");
          return res.redirect("/adminlogin");
        }
        return bcrypt
          .hash(password, 12)
          .then((hashedPassword) => {
            const admin = new Admin({
              userName: userName,
              password: hashedPassword,
              Name: name,
            });
            return admin.save();
          })
          .then((result) => {
            console.log("acha");
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    console.log("diff");
  }
};
