const express = require('express');
const router = express.Router();

const adminController = require("../controllers/admin");

router.post('/login', adminController.postLogin);

router.post('/signup', adminController.postSignup);

router.post('/logout', adminController.postLogout);

router.get('/home', adminController.getHome);



module.exports = router;