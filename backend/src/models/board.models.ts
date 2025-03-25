import mongoose, { Schema, Document } from "mongoose";

export interface IBoard extends Document {
  name: string;
  user: mongoose.Schema.Types.ObjectId;
  paintings: mongoose.Schema.Types.ObjectId[];
}

const BoardSchema = new Schema<IBoard>(
  {
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    paintings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Painting" }],
  },
  { timestamps: true }
);

export default mongoose.model<IBoard>("Board", BoardSchema);
