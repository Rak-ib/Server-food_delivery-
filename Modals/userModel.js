const mongoose = require('mongoose');

const UserSchema=mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    image:{
        type:String
    },
    cartData:{
        type:Object,
        default:{}
    }
},{minimize:false},{timestamps: true})

const User=mongoose.model("User",UserSchema);
module.exports=User