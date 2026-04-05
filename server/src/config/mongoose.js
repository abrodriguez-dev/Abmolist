import mongoose from "mongoose";

export async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("Falta la variable MONGODB_URI.");
  }

  await mongoose.connect(mongoUri);
}

