const express = require('express');
const { login, register, logout, currentUser, googleLogin } = require('../Controller/user_controller');
const {authMiddleware} = require('../Middleware/auth');
const userRoute=express.Router();


userRoute.post("/login",login)
userRoute.post("/register",register)
userRoute.get('/logout',logout)
userRoute.get("/currentUser",authMiddleware,currentUser)
userRoute.post("/googleLogin",googleLogin)

module.exports=userRoute