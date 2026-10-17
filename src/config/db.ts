import mongoose from "mongoose";

let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connectDatabase(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not set");
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(mongoUri, { serverSelectionTimeoutMS: 5000 })
      .then((connection) => {
        console.log("Connected to MongoDB");
        return connection;
      })
      .catch((error: unknown) => {
        connectionPromise = null;
        throw error;
      });
  }

  await connectionPromise;
}

