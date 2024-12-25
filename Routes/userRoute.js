const express = require('express');
const { login, register, logout, currentUser } = require('../Controller/user_controller');
const userRoute=express.Router();


userRoute.post("/login",login)
userRoute.post("/register",register)
userRoute.get('/logout',logout)
userRoute.get("/currentUser",currentUser)

module.exports=userRoute