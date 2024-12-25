const express = require('express');
const authMiddleware = require('../Middleware/auth');
const { placeOrder, verifyOrder, userOrder, ordersList } = require('../Controller/order_controller');
const orderRoute=express.Router();




orderRoute.post("/placeOrder",authMiddleware,placeOrder)
orderRoute.post('/verify',verifyOrder)
orderRoute.get("/userOrder",authMiddleware,userOrder)
orderRoute.get("/orderList",ordersList)



module.exports=orderRoute;