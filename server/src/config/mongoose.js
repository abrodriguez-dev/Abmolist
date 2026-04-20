import mongoose from "mongoose";

let connectionPromise = null;

export async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("Falta la variable MONGODB_URI.");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(mongoUri).catch((error) => {
      connectionPromise = null;
      throw error;
    });
  }

  await connectionPromise;

  return mongoose.connection;
}
