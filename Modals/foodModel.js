const mongoose = require('mongoose');

const food_model=mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        image:{
            type:String,
            required:true
        },
        category:{
            type:String,
            required:true
        }
    },{
        timestamps: true
    
    }
)
const food=mongoose.model("food",food_model);
module.exports=food