import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    let mongodbURL = process.env.MONGODB_URI;
    const projectName = "resume-builder";
    console.log(`MONGODB_URL from environment: ${mongodbURL}`);

    if (!mongodbURL) {
      throw new Error("MONGODB_URL is not defined in environment variables");
    }

    if (mongodbURL.endsWith("/")) {
      mongodbURL = mongodbURL.slice(0, -1);
    }

    console.log(`Connecting to MongoDB at ${mongodbURL}/${projectName}`);
    const url = `${mongodbURL}/${projectName}`;
    console.log(`Constructed MongoDB URL: ${url}`);

    await mongoose.connect(url);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectDB;
