import { MongoMemoryReplSet } from "mongodb-memory-server";

export default async () => {
    const replset: MongoMemoryReplSet = (global as any).__MONGOINSTANCE;

    await replset.stop();
};
