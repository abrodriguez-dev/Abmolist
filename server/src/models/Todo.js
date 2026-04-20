import mongoose from "mongoose";

const TASK_STATUSES = ["todo", "in_progress", "completed"];

const todoSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: "",
      trim: true
    },
    status: {
      type: String,
      enum: TASK_STATUSES,
      default: "todo"
    },
    dueDate: {
      type: Date,
      default: null
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;
export { TASK_STATUSES };
