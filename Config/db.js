const mongoose = require("mongoose");

const connect = async () => {
    try {
        if (!process.env.DB_name || !process.env.DB_pass) {
            console.error("❌ Missing MongoDB credentials. Set DB_name and DB_pass in Vercel.");
            process.exit(1);
        }

        await mongoose.connect(`mongodb+srv://${process.env.DB_name}:${process.env.DB_pass}@cluster0.oylcme6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`, {
            serverSelectionTimeoutMS: 50000,
        });

        console.log("✅ DB connected");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);  // Exit process if DB fails
    }
};

module.exports = { connect };
