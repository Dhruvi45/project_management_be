import mongoose from "mongoose";
import { getMongoUrl } from "./config";

mongoose
  .connect(getMongoUrl(), {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));
