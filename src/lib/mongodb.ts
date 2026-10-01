import { MongoClient } from "mongodb";

const mongoUri = process.env.BETTER_AUTH_DB_URL;

if (!mongoUri) {
  throw new Error("BETTER_AUTH_DB_URL is not defined");
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};

export const mongoClient =
  globalForMongo.mongoClient ?? new MongoClient(mongoUri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = mongoClient;
}

export const database = mongoClient.db("better_auth_db_blood_donor");
