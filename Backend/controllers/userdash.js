const User = require("../models/user");
const Drone = require('../models/drone');
const jlol = require("jsonwebtoken");
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();

exports.dashboard = async(req, res, next) => {
    const token = req.query.cookieValue;
    //const token = req.cookies["access-token"];
    const data = jlol.verify(token, "jwtsecretplschange");
    uid=data.id;
    let user = await User.findOne({_id:uid});
    let drones=await Drone.find({ userId: uid })
    res.status(200).send({ user:user,drones:drones });
}

exports.takeoffForm = (req, res, next) => {
    const drone_id = req.query.droneid;
    const token = req.query.cookieValue;
    const data = jlol.verify(token, "jwtsecretplschange");
    uid=data.id;
    if(uid)
    {
        Drone.findById(drone_id).then((drone) => {
            console.log(drone.takeOffStatus);
                    drone.takeOffStatus = true;
                    drone.save().then((result) => {
                    });
                })
        res.status(200).send({ message: "Takeoff Successful" });
    
    }
    
}

exports.takeoffAndLand = (req, res, next) => {
    var id = req.body.drone_id;
    var lon_1 = req.body.lon_1;
    var lat_1 = req.body.lat_1;
    var lon_2 = req.body.lon_2;
    var lat_2 = req.body.lat_2;
    var lon_3 = req.body.lon_3;
    var lat_3 = req.body.lat_3;
    var lon_4 = req.body.lon_4;
    var lat_4 = req.body.lat_4;
    var lat_ch=req.body.lat_ch;
    var lon_ch=req.body.lon_ch;
    var gridCoords = [];
    gridCoords.push(
        { lat: lat_1, lng: lon_1 },
        { lat: lat_2, lng: lon_2 },
        { lat: lat_3, lng: lon_3 },
        { lat: lat_4, lng: lon_4 }
    );
    let latimin=gridCoords[0].lat
    let longimin=gridCoords[0].lng
    for(let i=1;i<4;i++)
    {
        latimin=Math.min(latimin,gridCoords[i].lat)
        longimin=Math.min(longimin,gridCoords[i].lng)
    }
    let latimax=gridCoords[0].lat
    let longimax=gridCoords[0].lng
    for(let i=1;i<4;i++)
    {
        latimax=Math.max(latimax,gridCoords[i].lat)
        longimax=Math.max(longimax,gridCoords[i].lng)
    }
    if(lat_ch==undefined)
    {
        lat_ch=0.00005;
    }
    if(lon_ch==undefined)
    {
        lon_ch=0.0001;
    }
    Drone.findById(id).then((drone) => {
        console.log(drone.takeOffStatus);
        drone.area = [];
        drone.area.push(
            { lat: lat_1, lon: lon_1 },
            { lat: lat_2, lon: lon_2 },
            { lat: lat_3, lon: lon_3 },
            { lat: lat_4, lon: lon_4 },
            { lat: lat_ch, lon: lon_ch}
        );
        drone.takeOffStatus = true;
        drone.save().then((result) => {
        });
    })
    res.redirect('/');
}

exports.grid = async (req, res, next) => {
    var id = req.body.drone_id;
    var lon_1 = req.body.lon_1;
    var lat_1 = req.body.lat_1;
    var lon_2 = req.body.lon_2;
    var lat_2 = req.body.lat_2;
    var lon_3 = req.body.lon_3;
    var lat_3 = req.body.lat_3;
    var lon_4 = req.body.lon_4;
    var lat_4 = req.body.lat_4;
    var lat_ch=req.body.lat_ch;
    var lon_ch=req.body.lon_ch;
    var gridCoords = [];
    gridCoords.push(
        { lat: lat_1, lng: lon_1 },
        { lat: lat_2, lng: lon_2 },
        { lat: lat_3, lng: lon_3 },
        { lat: lat_4, lng: lon_4 }
    );
    let latimin=gridCoords[0].lat
    let longimin=gridCoords[0].lng
    for(let i=1;i<4;i++)
    {
        latimin=Math.min(latimin,gridCoords[i].lat)
        longimin=Math.min(longimin,gridCoords[i].lng)
    }
    let latimax=gridCoords[0].lat
    let longimax=gridCoords[0].lng
    for(let i=1;i<4;i++)
    {
        latimax=Math.max(latimax,gridCoords[i].lat)
        longimax=Math.max(longimax,gridCoords[i].lng)
    }
    if(lat_ch==undefined)
    {
        lat_ch=0.00005;
    }
    if(lon_ch==undefined)
    {
        lon_ch=0.0001;
    }
    res.render('customer/grid',{drone_id: id,gridCoords:gridCoords,latimax:latimax,longimax:longimax,lat_ch:lat_ch,lon_ch:lon_ch})
}