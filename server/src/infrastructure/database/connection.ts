import { config } from "@/app.config";
import mongoose from "mongoose";
import { logger } from "../utils/Logger";

export const connectDB = async () =>{
    try {
        await mongoose.connect(config.dbUrl)
        logger.info("MongoDb connected Successful.")
    } catch (error) {
        logger.error("MongoDB Connection Error!",error)
    }
}