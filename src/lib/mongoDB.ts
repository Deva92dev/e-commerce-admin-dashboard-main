/* eslint-disable no-var */
import mongoose, { Mongoose } from "mongoose";
import { env } from "../../env";

const MONGO_URI = env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is missing in the environment.");
  throw new Error("Please define the MONGO_URI environment variable");
}

interface GlobalMongoose {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: GlobalMongoose | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const ConnectDB = async () => {
  if (!cached) {
    throw new Error("MongoDB cache is not initialized");
  }

  if (cached.conn) {
    return cached.conn;
  }

  cached.promise = mongoose.connect(MONGO_URI, {
    bufferCommands: false,
    maxPoolSize: 10,
  });

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      // Enable Mongoose debugging if in development
      if (process.env.NODE_ENV !== "production") {
        mongoose.set("debug", true); // Enable query logging
      }
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};
