import mongoose from "mongoose";
import dotenv from "dotenv";
import Users from "./model/schema.users.js";
import { readFile } from "fs/promises";

dotenv.config();

const users = JSON.parse(await readFile("./jsonFile/users.json"));

await mongoose.connect(process.env.MONGO_URI);

for (const user of users) {
  await Users.findOneAndUpdate(
    { email: user.email },
    { $set: user },
    { upsert: true, new: true },
  );
}

console.log("Utilisateurs importés!");
await mongoose.disconnect();
