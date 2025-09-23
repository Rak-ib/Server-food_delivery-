// const express = require('express');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const { connect } = require('./Config/db.js');
// const foodRoute = require('./Routes/foodRoute.js');
// const userRoute = require('./Routes/userRoute.js');
// const cartRoute = require('./Routes/cartRoute.js');
// const orderRoute = require('./Routes/orderRoute.js');

// const app = express();

// // Middleware
// app.use(express.json());

// // app.use(express.json());
// app.use(express.urlencoded({ extended: true })); // ← THIS IS CRUCIAL FOR SSLCOMMERZ
// app.use(cors({
//     origin: process.env.CLIENT_URL,  // Use environment variable for frontend URL
//     credentials: true
// }));
// app.use(cookieParser(process.env.COOKIE_SECRET));

// // Database Connection
// connect();

// // Routes
// app.use("/food", foodRoute);
// app.use("/user", userRoute);
// app.use("/cart", cartRoute);
// app.use("/order", orderRoute);
// // Default Route
// app.get("/", (req, res) => {
//     res.send("Food Delivery API is running!");
// });

// // Export the Express app (required for Vercel)
// module.exports = app;

// if (process.env.NODE_ENV !== "production") {
//     const port = process.env.PORT || 5000;
//     app.listen(port, () => {
//         console.log(`App is running on port ${port}`);
//     });
// }






// index.js
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}


const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Basic middleware first
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(cookieParser(process.env.COOKIE_SECRET));

// Test route - works without database
app.get("/", (req, res) => {
    res.json({
        message: "Food Delivery API is running!",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Database connection with proper error handling
let dbConnected = false;
const initializeDatabase = async () => {
    try {
        const { connect } = require('./Config/db.js');
        await connect();
        dbConnected = true;
        console.log('✅ Database initialized successfully');
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        dbConnected = false;
        // Don't crash the app, continue without database
    }
};

// Initialize database
initializeDatabase();

// Routes with error handling
try {
    const foodRoute = require('./Routes/foodRoute.js');
    const userRoute = require('./Routes/userRoute.js');
    const cartRoute = require('./Routes/cartRoute.js');
    const orderRoute = require('./Routes/orderRoute.js');

    app.use("/food", foodRoute);
    app.use("/user", userRoute);
    app.use("/cart", cartRoute);
    app.use("/order", orderRoute);
    
    console.log('✅ All routes loaded successfully');
} catch (error) {
    console.error('❌ Error loading routes:', error.message);
    
    // Fallback routes for debugging
    app.get("/food", (req, res) => {
        res.status(503).json({ error: "Food routes not available", message: error.message });
    });
    app.get("/user", (req, res) => {
        res.status(503).json({ error: "User routes not available", message: error.message });
    });
    app.get("/cart", (req, res) => {
        res.status(503).json({ error: "Cart routes not available", message: error.message });
    });
    app.get("/order", (req, res) => {
        res.status(503).json({ error: "Order routes not available", message: error.message });
    });
}

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        service: "Food Delivery API",
        database: dbConnected ? "Connected" : "Disconnected",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API info endpoint
app.get("/api", (req, res) => {
    res.json({
        message: "Food Delivery API",
        version: "1.0.0",
        endpoints: {
            health: "/health",
            food: "/food",
            user: "/user", 
            cart: "/cart",
            order: "/order"
        },
        database: dbConnected ? "Connected" : "Disconnected",
        timestamp: new Date().toISOString()
    });
});

// Global error handling middleware
app.use((error, req, res, next) => {
    console.error('🚨 Global Error:', error.message);
    console.error('Stack:', error.stack);
    
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : error.message,
        timestamp: new Date().toISOString(),
        path: req.path
    });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.originalUrl}`,
        availableRoutes: ['/health', '/api', '/food', '/user', '/cart', '/order'],
        timestamp: new Date().toISOString()
    });
});

// Export the Express app for Vercel
module.exports = app;

// Only start server in local development
if (process.env.NODE_ENV !== "production") {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`🚀 Server running on port ${port}`);
        console.log(`📡 Health check: http://localhost:${port}/health`);
        console.log(`📋 API info: http://localhost:${port}/api`);
    });
}










// {
//   "name": "food-delivery-server",
//   "version": "1.0.0",
//   "description": "",
//   "main": "index.js",
//   "scripts": {
//     "start": "node index.js",
//     "dev": "nodemon index.js"
//   },
//   "keywords": [],
//   "author": "",
//   "license": "ISC",
//   "dependencies": {
//     "@vercel/node": "^3.2.0",
//     "axios": "^1.11.0",
//     "bcryptjs": "^3.0.2",
//     "body-parser": "^1.20.2",
//     "cloudinary": "^2.2.0",
//     "cookie-parser": "^1.4.6",
//     "cors": "^2.8.5",
//     "dotenv": "^16.4.5",
//     "express": "^4.19.2",
//     "google-auth-library": "^10.3.0",
//     "jsonwebtoken": "^9.0.2",
//     "mongoose": "^8.5.0",
//     "multer": "^1.4.5-lts.1",
//     "stripe": "^16.4.0",
//     "validator": "^13.12.0"
//   }
// }
