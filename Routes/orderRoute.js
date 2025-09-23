// const express = require('express');
// const {authMiddleware, verifyAdmin} = require('../Middleware/auth');
// const { placeOrder, verifyOrder, userOrder, ordersList, updateOrderStatus, executeBkashPayment, refundBkashPayment } = require('../Controller/order_controller');
// const orderRoute=express.Router();




// orderRoute.post("/placeOrder",authMiddleware,placeOrder)
// // orderRoute.post('/bkash/execute', authMiddleware, executeBkashPayment); // finalize payment
// // orderRoute.post('/bkash/refund', authMiddleware, refundBkashPayment);   // (admin / merchant)
// orderRoute.post('/verify',verifyOrder)
// orderRoute.get("/userOrder",authMiddleware,userOrder)
// orderRoute.get("/orderList",verifyAdmin,ordersList)
// orderRoute.put("/:orderId/status",verifyAdmin,updateOrderStatus)
// // orderRoute.get('/bkash/callback', (req, res) => {
// //     const { status, paymentID } = req.query;
// //     console.log('bKash callback:', req.query);
    
// //     // Redirect to frontend with parameters
// //     const redirectUrl = `${process.env.FRONTEND_URL}/payment/callback?status=${status}&paymentID=${paymentID}`;
// //     res.redirect(redirectUrl);
// // });





// // Initiate
// orderRoute.post('/sslcommerz/initiate', initiatePayment);

// // Success / Fail / Cancel
// orderRoute.post('/sslcommerz/success', success);
// orderRoute.get('/sslcommerz/success', success);
// orderRoute.post('/sslcommerz/fail', (req, res) =>
//   res.redirect(`${process.env.FRONTEND_URL}/payment/fail`)
// );
// orderRoute.post('/sslcommerz/cancel', (req, res) =>
//   res.redirect(`${process.env.FRONTEND_URL}/payment/cancel`)
// );

// // IPN (server-to-server)
// orderRoute.post('/sslcommerz/ipn', ipn);


// module.exports=orderRoute;




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