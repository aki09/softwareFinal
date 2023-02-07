const express = require('express');
const router = express.Router();
const validateToken  = require("../middleware/adminverify");

const adminController = require("../controllers/admin");

router.post('/login', adminController.postLogin);

router.post('/signup', adminController.postSignup);

router.post('/logout', adminController.postLogout);

router.get('/home', validateToken, adminController.getHome);



module.exports = router;