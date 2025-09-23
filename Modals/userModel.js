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
    password: {
        type: String,
        required: false,   
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    googleId: {           
        type: String,
        unique: true,
        sparse: true       // avoids errors if some users don’t have googleId
    },
    image: {
        type: String
    },
    cartData:{
        type:Object,
        default:{}
    }
},{minimize:false},{timestamps: true})

const User=mongoose.model("User",UserSchema);
module.exports=User