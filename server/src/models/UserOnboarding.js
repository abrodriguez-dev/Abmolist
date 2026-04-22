import mongoose from "mongoose";

const userOnboardingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    sampleTasksSeededAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const UserOnboarding = mongoose.model("UserOnboarding", userOnboardingSchema);

export default UserOnboarding;
