const express = require('express');
const { addFood, food_list, remove_food, food_image_remove } = require('../Controller/food_controller.js');
const { verifyAdmin } = require('../Middleware/auth.js');
const foodRoute = express.Router();

foodRoute.post("/add",verifyAdmin, addFood);
foodRoute.get("/food_list", food_list);
foodRoute.delete("/remove/:id",verifyAdmin,remove_food);
foodRoute.post("/remove/food_image",verifyAdmin,food_image_remove)

module.exports = foodRoute;