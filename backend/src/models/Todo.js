import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    dueDate: { type: Date },
    priority: {
      type: String,
      enum: ["", "low", "medium", "high"],
      default: "",
    },
    order: { type: Number, default: 0 },
    deleted: { type: Boolean, default: false },
    notes: { type: String },
    labels: [{ type: String }],

    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TodoList",
      required: true,
    },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Todo", todoSchema);
