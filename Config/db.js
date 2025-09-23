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


// // const mongoose = require('mongoose');

// // const connect = async () => {
// //     try {
        
// //         if (!process.env.DB_name || !process.env.DB_pass) {
// //             console.error("❌ Missing MongoDB credentials");
// //             throw new Error("Missing DB credentials");
// //         }

// //         // CORRECTED: DB_name should be username, and add database name to the URI
// //         const mongoURI = `mongodb+srv://${process.env.DB_name}:${process.env.DB_pass}@cluster0.oylcme6.mongodb.net/food_delivery?retryWrites=true&w=majority&appName=Cluster0`;
        
// //         await mongoose.connect(mongoURI, {
// //             serverSelectionTimeoutMS: 30000,
// //             socketTimeoutMS: 30000,
// //         });
        
// //         console.log("✅ DB connected successfully");
// //     } catch (error) {
// //         console.error("❌ MongoDB Connection Error:", error.message);
// //         // DON'T use process.exit(1) in serverless functions - it crashes them
// //         throw error;
// //     }
// // };

// // module.exports = { connect };


// const mongoose = require('mongoose');

// // Cache the database connection in development/serverless environment
// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// const connect = async () => {
//   // If we already have a connection, return it
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false, // Disable mongoose buffering for serverless
//       serverSelectionTimeoutMS: 5000, // Reduced timeout for serverless
//       socketTimeoutMS: 45000,
//       family: 4 // Use IPv4, skip trying IPv6
//     };

//     if (!process.env.DB_name || !process.env.DB_pass) {
//       throw new Error("Missing MongoDB credentials");
//     }

//     const mongoURI = `mongodb+srv://${process.env.DB_name}:${process.env.DB_pass}@cluster0.oylcme6.mongodb.net/food_delivery?retryWrites=true&w=majority`;
    
//     cached.promise = mongoose.connect(mongoURI, opts).then((mongoose) => {
//       console.log("✅ MongoDB connected");
//       return mongoose;
//     });
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// };

// module.exports = { connect };