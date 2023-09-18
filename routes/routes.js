const express = require("express");
const router = express.Router();
const session = require('express-session')
const User = require("../models/users");
const adminControllers = require('../controllers/admin_controller');
const userControllers = require('../controllers/user_controller')



// admin get

router.get('/', userControllers.loginPage)
router.get("/dashboard", adminControllers.dashboardGet)
router.get("/add", adminControllers.addGet)
router.get('/admin',adminControllers.adminGet)
router.get('/edit/:id', adminControllers.editGet)
router.get('/delete/:id', adminControllers.deleteGet)
router.get('/adminLogout',adminControllers.adminLogout)


//admin post

router.post('/admin' , adminControllers.adminPost)
router.post("/add", adminControllers.addPost)
router.post('/update/:id', adminControllers.updatePost)


//user get

router.get('/signup', userControllers.signupGet)
router.get('/home', userControllers.getHome)
router.get('/logout-user', userControllers.userLogout)

//user post

router.post('/signup', userControllers.signupPost)
router.post('/login', userControllers.loginPost)

module.exports = router;