const express = require('express');
const { addToCart, getFromCart, removeFromCart } = require('../Controller/cart_controller');
const authMiddleware = require('../Middleware/auth');
const cartRoute=express.Router();



cartRoute.post("/add",authMiddleware,addToCart);
cartRoute.get("/get",authMiddleware,getFromCart);
cartRoute.post("/remove",authMiddleware,removeFromCart);


module.exports=cartRoute