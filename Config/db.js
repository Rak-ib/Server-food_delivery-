



const mongoose = require('mongoose');
require('dotenv').config();
const connect = async () => {
  try {
    await mongoose.connect(`mongodb+srv://${process.env.DB_name}:${process.env.DB_pass}@cluster0.oylcme6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`, {
      serverSelectionTimeoutMS: 50000,});
    console.log("DB connected");
  } catch (error) {
    console.error("Connection error", error);
  }
};




module.exports={connect}