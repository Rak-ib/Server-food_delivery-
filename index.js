const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connect } = require('./Config/db.js');
const foodRoute = require('./Routes/foodRoute.js');
const userRoute = require('./Routes/userRoute.js');
const cartRoute = require('./Routes/cartRoute.js');
const orderRoute = require('./Routes/orderRoute.js');
// require('dotenv').config(); 

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(cookieParser(process.env.COOKIE_SECRETE));

// Database Connection
connect();

// Routes
app.use("/food", foodRoute);
app.use("/user",userRoute);
app.use("/cart",cartRoute);
app.use("/order",orderRoute)

app.listen(port, () => {
    console.log("App is running");
});
