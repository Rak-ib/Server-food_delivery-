const express = require('express');
const { addFood, food_list } = require('../Controller/food_controller.js');
const foodRoute = express.Router();

foodRoute.post("/add", addFood);
foodRoute.get("/food_list", food_list);

module.exports = foodRoute;