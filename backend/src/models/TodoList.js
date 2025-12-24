import mongoose from "mongoose";

const todoListSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("TodoList", todoListSchema);
