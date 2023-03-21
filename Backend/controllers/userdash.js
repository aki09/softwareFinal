const User = require("../models/user");
const Drone = require('../models/drone');
const Error = require('../models/error');
const jlol = require("jsonwebtoken");
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();

exports.dashboard = async (req, res, next) => {
    const token = req.query.cookieValue;
    if (!token) {
      return res.status(401).send("Authentication token missing");
    }
    try {
      const data = jlol.verify(token, process.env.usersecret);
      const uid = data.id;
      let user = await User.findOne({ _id: uid });
      let drones = await Drone.find({ userId: uid });
      res.status(200).send({ user: user, drones: drones });
    } catch (error) {
      res.status(401).send("Invalid authentication token");
    }
  };

exports.set = async (req, res, next) => {
    const { droneid, userid, eror } = req.body;
  
    const error = new Error({
      droneId: droneid,
      userId: userid,
      timestamps: new Date(),
      title: eror
    });
  
    error.save()
      .then(result => {
      })
      .catch(error => {
        console.error(error);
      });
  }

exports.settakeoff=async(req,res,next)=>{
    const drone_id=req.query.droneid;
    Drone.findById(drone_id).then((drone) => {
        drone.takeOffStatus = false;
        drone.save().then((result) => {
        });
    })
    res.status(200).send({ message: "Landed Successful" });
}

exports.takeoffForm = (req, res, next) => {
    const drone_id = req.query.droneid;
    const token = req.query.cookieValue;
    if (!token) {
      return res.status(401).send("Authentication token missing");
    }
    try {
      const data = jlol.verify(token, process.env.usersecret);
      uid=data.id;
      if(uid)
      {
          res.status(200).send({ message: " Successful" });
      }
    } catch (error) {
      res.status(401).send("Invalid authentication token");
    }
    
}

exports.takeoffAndLand = (req, res, next) => {
    var id = req.body.id;
    var markers=req.body.markers;
    var arrayDist=req.body.arrayDist;
    var gridCoords = [];
    gridCoords.push(
        { lat: markers[0].lat, lng: markers[0].lng },
        { lat: markers[1].lat, lng: markers[1].lng },
        { lat: markers[2].lat, lng: markers[2].lng },
        { lat: markers[3].lat, lng: markers[3].lng }
    );
    Drone.findById(id).then((drone) => {
        drone.area = [];
        drone.area.push(
            { lat: markers[0].lat, lon: markers[0].lng },
            { lat: markers[1].lat, lon: markers[1].lng },
            { lat: markers[2].lat, lon: markers[2].lng },
            { lat: markers[3].lat, lon: markers[3].lng }
        );
        drone.takeOffStatus = true;
        drone.arrayDist=arrayDist;
        drone.save().then((result) => {
        });
    })
    res.status(200).send({ message: "Takeoff Successful" });
}