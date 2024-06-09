import { MongoMemoryReplSet } from "mongodb-memory-server";
import * as mongoose from "mongoose";

export default async () => {
    const replset = await MongoMemoryReplSet.create({ replSet: { count: 4 } });

    const uri = replset.getUri();

    (global as any).__MONGOINSTANCE = replset;
    process.env.MONGODB_URI = uri.slice(0, uri.lastIndexOf("/"));

  // Clean DB before test starts
  mongoose.set("strictQuery", false);
  const conn = await mongoose.connect(
    `${process.env.MONGODB_URI}/mock_league_test`
  );
  await conn.connection.db.dropDatabase();
  await mongoose.disconnect();
};
