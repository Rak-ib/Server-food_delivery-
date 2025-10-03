



const express = require('express');
const { authMiddleware, verifyAdmin } = require('../Middleware/auth');
const { 
    placeOrder, 
    success,
    verifyOrder, 
    userOrder, 
    ordersList, 
    updateOrderStatus, 
    getAnalytics
} = require('../Controller/order_controller');

const orderRoute = express.Router();

// Order management routes
orderRoute.post("/placeOrder", authMiddleware, placeOrder);
orderRoute.post('/verify', verifyOrder);
orderRoute.get("/userOrder", authMiddleware, userOrder);
orderRoute.get("/orderList", verifyAdmin, ordersList);
orderRoute.put("/:orderId/status", verifyAdmin, updateOrderStatus);
orderRoute.get("/analytics", verifyAdmin, getAnalytics);

// SSLCommerz callback routes (both GET and POST for flexibility)
orderRoute.post('/sslcommerz/success', success);
orderRoute.get('/sslcommerz/success', success);


// Failure and cancel redirects
orderRoute.post('/sslcommerz/fail', (req, res) => {
    console.log('Payment failed:', req.body);
    res.redirect(`${process.env.FRONTEND_URL}/payment/fail`);
});

orderRoute.get('/sslcommerz/fail', (req, res) => {
    console.log('Payment failed:', req.query);
    res.redirect(`${process.env.FRONTEND_URL}/payment/fail`);
});

orderRoute.post('/sslcommerz/cancel', (req, res) => {
    console.log('Payment cancelled:', req.body);
    res.redirect(`${process.env.FRONTEND_URL}/payment/cancel`);
});

orderRoute.get('/sslcommerz/cancel', (req, res) => {
    console.log('Payment cancelled:', req.query);
    res.redirect(`${process.env.FRONTEND_URL}/payment/cancel`);
});


module.exports = orderRoute;