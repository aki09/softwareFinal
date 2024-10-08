const express = require('express');
const router = express.Router();

const adminController = require("../controllers/admin");

router.post('/login', adminController.postLogin);

router.post('/signup', adminController.postSignup);

router.get('/home', adminController.getHome);

router.get('/adduser', adminController.adduser);

router.get('/removeuser', adminController.removeuser);

router.get('/allotdrone', adminController.allotdrone);



module.exports = router;