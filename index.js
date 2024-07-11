const express = require('express');
const cors = require('cors');
const { connect } = require('./Config/db.js');
const foodRoute = require('./Routes/foodRoute.js');

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
connect();

// Routes
app.use("/food", foodRoute);

app.listen(port, () => {
    console.log("App is running");
});
