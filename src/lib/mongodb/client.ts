import { MongoClient } from "mongodb";

const globalMongo = globalThis as typeof globalThis & { __portfolioMongoClient?: Promise<MongoClient> };

export function getMongoClient(uri?: string) {
  if (!uri) return null;
  if (!globalMongo.__portfolioMongoClient) {
    globalMongo.__portfolioMongoClient = new MongoClient(uri, {
      maxPoolSize: 5,
      connectTimeoutMS: 5_000,
      serverSelectionTimeoutMS: 5_000,
    }).connect();
  }
  return globalMongo.__portfolioMongoClient;
}
