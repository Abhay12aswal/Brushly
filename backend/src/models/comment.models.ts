import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  painting: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  text: string;
}

const CommentSchema = new Schema<IComment>(
  {
    painting: { type: mongoose.Schema.Types.ObjectId, ref: "Painting", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IComment>("Comment", CommentSchema);
