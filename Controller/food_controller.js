const food = require("../Modals/foodModel");
const mongoose = require('mongoose');

const addFood = async (req, res) => {
    console.log("hello");
    const { name, description, price, category, image } = req.body;
    const foodItem = new food({
        name, description, price, category, image
    });
    try {
        const result = await foodItem.save();
        console.log(result);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}

const food_list=async(req,res)=>{
    try {
        const result=await food.find();
        console.log(result);
        res.send(result)

    } catch (error) {
        console.log("error",error);
        res.send(error)
    }
}

module.exports = { addFood ,food_list};