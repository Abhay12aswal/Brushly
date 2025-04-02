import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { Painting } from "../models/painting.models.js";
import ApiError from "../utils/ApiError.js";
import { Comment } from "../models/comment.models.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";

interface reqAuth extends Request {
  user: {
    _id: string;
  };
}

// addComment – Add a comment to a painting.
export const addComment = AsyncHandler(
  async (req: reqAuth, res: Response, next: NextFunction) => {
    const id = req.user?._id;

    const { paintingId } = req.params;
    const { text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(paintingId)) {
      throw new ApiError(400, "Invalid painting ID");
    }

    const painting = await Painting.findById(paintingId);
    if (!painting) {
      throw new ApiError(404, "Painting not found");
    }

    if (!text || text.trim() === "") {
      throw new ApiError(400, "Text required");
    }

    const newComment = await Comment.create({
      painting: paintingId,
      user: id,
      text: text.trim(),
    });

    //push to painting model
    painting.comments.push(newComment._id as mongoose.Schema.Types.ObjectId);
    await painting.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "Comment added successfully", newComment));
  }
);

// getComments – Fetch all comments for a painting.
export const getComment = AsyncHandler(
  async (req: reqAuth, res: Response, next: NextFunction) => {
    const { paintingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(paintingId)) {
      throw new ApiError(400, "Invalid painting ID");
    }

    const painting = await Painting.findById(paintingId).populate({
      path: "comments",
      populate: {
        path: "user",
        select: "username email",
      },
    });

    if (!painting) {
      throw new ApiError(404, "Painting not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Comments fetched successfully", painting.comments)
      );
  }
);

// deleteComment – Allow users to delete their comment.
export const deleteComment = AsyncHandler(async (req: reqAuth, res: Response, next: NextFunction) => {

    const { commentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    // Find the comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // Ensure the user deleting the comment is the owner
    if (comment.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this comment");
    }

    // Remove comment from the Painting.comments array
    await Painting.findByIdAndUpdate(comment.painting, {
        $pull: { comments: comment._id }
    });

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json(
        new ApiResponse(200, "Comment deleted successfully", null)
    );
});
