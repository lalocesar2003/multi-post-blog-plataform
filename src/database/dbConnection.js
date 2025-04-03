import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Server connected.");
  } catch (error) {
    console.log(`Server connection failed : ${error.message}`);
  }
};

export default dbConnection;
