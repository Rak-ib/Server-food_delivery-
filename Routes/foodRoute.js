const express = require('express');
const { addFood, food_list, remove_food, food_image_remove } = require('../Controller/food_controller.js');
const foodRoute = express.Router();

foodRoute.post("/add", addFood);
foodRoute.get("/food_list", food_list);
foodRoute.delete("/remove/:id",remove_food);
foodRoute.post("/remove/food_image",food_image_remove)

module.exports = foodRoute;