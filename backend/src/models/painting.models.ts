import mongoose, { Schema, Document } from "mongoose";

export interface IPainting extends Document {
  title: string;
  imageUrl: string;
  description?: string;
  tags: string[];
  artist: mongoose.Schema.Types.ObjectId;
  likes: mongoose.Schema.Types.ObjectId[];
  comments: mongoose.Schema.Types.ObjectId[];
  categories: string;
}

const PaintingSchema = new Schema<IPainting>(
  {
    title: {
      type: String,
      required: [true, "Please enter a title"],
    },
    imageUrl: {
      type: String,
      required: [true, "Please upload an image"],
    },
    description: {
      type: String,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    }],
    categories: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model<IPainting>("Painting", PaintingSchema);
