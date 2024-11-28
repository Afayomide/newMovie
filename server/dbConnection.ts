const mongoose = require("mongoose");


export default async function connectToMongo(dburl: string) {
    const retryAttempts = 3;
    const connectTimeoutMS = 20000;
  
    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
      try {
        await mongoose.connect(dburl, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          connectTimeoutMS,
        });
        console.log("Connected to Database");
        return;
      } catch (error: any) {
        console.error(`Connection attempt ${attempt} failed:`, error.message);
  
        await new Promise((resolve) =>
          setTimeout(resolve, Math.min(attempt * 2000, 10000))
        );
      }
    }
  
    throw new Error("Failed to connect to MongoDB Atlas after retries");
  }