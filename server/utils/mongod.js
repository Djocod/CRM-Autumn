import "dotenv/config";
import { MongoClient } from "mongodb";

// const client = new MongoClient(process.env.MONGO_URI);
// await client.connect();
// export const db = client.db();

import mongoose from "mongoose";
await mongoose.connect(process.env.MONGO_URI);
export default mongoose;
