const monggoose = require('mongoose');


const connectDB = async() =>{
    try {
        await monggoose.connect(process.env.MONGO_URL , {});
        console.log("MongoDB connected");
        
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
        process.exit(1); // Exit the process with failure   
    }
}

module.exports = connectDB;

