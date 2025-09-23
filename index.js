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





const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { connect } = require('./Config/db.js');
const foodRoute = require('./Routes/foodRoute.js');
const userRoute = require('./Routes/userRoute.js');
const cartRoute = require('./Routes/cartRoute.js');
const orderRoute = require('./Routes/orderRoute.js');

const app = express();

// Database Connection
connect();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration - flexible for development and production
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            process.env.CLIENT_URL,
            process.env.FRONTEND_URL,
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:5174'
            // Add your frontend Vercel URL here once deployed
            // 'https://your-frontend-domain.vercel.app'
        ].filter(Boolean); // Remove any undefined values
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
};

app.use(cors(corsOptions));

app.use(cookieParser(process.env.COOKIE_SECRET));

// Routes
app.use("/food", foodRoute);
app.use("/user", userRoute);
app.use("/cart", cartRoute);
app.use("/order", orderRoute);

// Default Route
app.get("/", (req, res) => {
    res.json({
        message: "Food Delivery API is running!",
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "OK", service: "Food Delivery API" });
});

// Export for Vercel
module.exports = app;

// Only run server locally
if (process.env.NODE_ENV !== "production") {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`App is running on port ${port}`);
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
