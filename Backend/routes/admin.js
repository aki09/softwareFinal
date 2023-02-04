const express = require('express');
const router = express.Router();
const validateToken  = require("../middleware/auth4");

const adminController = require("../controllers/admin");

router.get('/adminlogin', adminController.getLogin);

router.post('/adminlogin', adminController.postLogin);

router.post('/adminsignup', adminController.postSignup);

router.post('/adminlogout', adminController.postLogout);

router.get('/adminhome', validateToken, adminController.getHome);

module.exports = router;