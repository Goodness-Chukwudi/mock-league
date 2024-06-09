import mongoose from "mongoose";
import { beforeAll, afterAll } from "@jest/globals";

beforeAll(async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(process.env.MONGODB_URI!);
});

afterAll(async () => {
  await mongoose.disconnect();
});
