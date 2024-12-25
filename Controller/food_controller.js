const food = require("../Modals/foodModel");
const mongoose = require('mongoose');
const cloudinary=require('cloudinary').v2;




cloudinary.config({
    cloud_name: 'dcao1wljw',
    api_key: '8OYFWtKH7YBxbEQkzfw6u6kzNfU',
    api_secret: '663523557728679'
})





const addFood = async (req, res) => {
    console.log("hello");
    const { name, description, price, category, image } = req.body;
    // console.log("name",name,"description",description,price, category,"  imag",image);
    const foodItem = new food({name,description,price,category,image
         
    });
    try {
        const existingFood = await food.findOne({ name:name });

        if (existingFood) {      
            // If a food item with the same name exists, send a response indicating the conflict
            res.json({ message: "A food item with the same name already exists." ,success:false});
            return;
        }
        const result = await foodItem.save();
        console.log(result);
        res.json({success:true,message:"Food added successfully"});
    } catch (error) {
        console.log(error);
        res.json({message:error.data,success:false});
    }
}


const food_image_remove=async(req,res)=>{
    const { public_id } = req.body;

    try {
        const result = await cloudinary.uploader.destroy(public_id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete image', error });
    }
}

const food_list=async(req,res)=>{
    try {
        console.log("foodlist");
        const result=await food.find();
        console.log(result);
        res.json({message:result})

    } catch (error) {
        console.log("error",error);
        res.send(error)
    }
}

const remove_food=async(req,res)=>{
    try {
        const result=await food.findByIdAndDelete(req.params.id);
        console.log(req.params.id);
        res.json({message:"Food item deleted",success:true})
    } catch (error) {
        res.json({message:"Failed to deleted",success:false})
    }
}

module.exports = { addFood ,food_list,remove_food,food_image_remove};