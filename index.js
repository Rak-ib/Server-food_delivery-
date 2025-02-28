const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connect } = require('./Config/db.js');
const foodRoute = require('./Routes/foodRoute.js');
const userRoute = require('./Routes/userRoute.js');
const cartRoute = require('./Routes/cartRoute.js');
const orderRoute = require('./Routes/orderRoute.js');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL,  // Use environment variable for frontend URL
    credentials: true
}));
app.use(cookieParser(process.env.COOKIE_SECRET));

// Database Connection
connect();

// Routes
app.use("/food", foodRoute);
app.use("/user", userRoute);
app.use("/cart", cartRoute);
app.use("/order", orderRoute);
// Default Route
app.get("/", (req, res) => {
    res.send("Food Delivery API is running!");
});

// Export the Express app (required for Vercel)
module.exports = app;

if (process.env.NODE_ENV !== "production") {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`App is running on port ${port}`);
    });
}
