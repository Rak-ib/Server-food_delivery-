



const mongoose = require('mongoose');
require('dotenv').config();
const connect = async () => {
  try {
    await mongoose.connect(`mongodb+srv://${process.env.DB_name}:${process.env.DB_pass}@cluster0.oylcme6.mongodb.net/<dbname>?retryWrites=true&w=majority`, {
    });
    console.log("DB connected");
  } catch (error) {
    console.error("Connection error", error);
  }
};




module.exports={connect}