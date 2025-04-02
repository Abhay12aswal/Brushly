// createBoard – Create a new board.

import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { Board } from "../models/board.models.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import mongoose from "mongoose";

interface ReqAuth extends Request {
  user?: {
    _id: string;
  };
}

export const createBoard = AsyncHandler(
  async (req: ReqAuth, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const { name } = req.body;

    if (!name) return next(new ApiError(400, "Board name is required"));

    const board = await Board.create({ name, user: userId, paintings: [] });

    // Push board ID into user's `boards` array
    await User.findByIdAndUpdate(userId, { $push: { boards: board._id } });

    res
      .status(201)
      .json(new ApiResponse(200, "Board created successfully", board));
  }
);

// Get all boards of a user
export const getUserBoards = AsyncHandler(
  async (req: ReqAuth, res: Response, next: NextFunction) => {
    const userId = req.user?._id;

    const user = await User.findById(userId).populate("boards");

    res.status(200).json({ success: true, boards: user?.boards });
  }
);

// Get a specific board with its paintings
export const getBoardById = AsyncHandler(
  async (req: ReqAuth, res: Response, next: NextFunction) => {
    const { boardId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(boardId))
      return next(new ApiError(400, "Invalid board Id"));

    const board = await Board.findById(boardId).populate("paintings");
    if (!board) return next(new ApiError(400, "Board not found"));

    res
      .status(200)
      .json(new ApiResponse(200, "Board fetched successfully", board));
  }
);

// Add a painting to a board
export const addPaintingToBoard = AsyncHandler(
  async (req: ReqAuth, res: Response, next: NextFunction) => {
    const { boardId, paintingId } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(boardId) ||
      !mongoose.Types.ObjectId.isValid(paintingId)
    ) {
      return next(new ApiError(400, "Invalid Board or painting Id"));
    }

    const board = await Board.findById(boardId);
    if (!board) return next(new ApiError(400, "Board not found"));

    if (board.paintings.includes(paintingId)) {
      return next(new ApiError(400, "Painting already to board"));
    }

    board.paintings.push(paintingId);
    await board.save()

    res
      .status(200)
      .json(new ApiResponse(200, "painting added to board", board));
  }
);

// Remove a painting from a board
export const removePaintingFromBoard = AsyncHandler(
  async (req: ReqAuth, res: Response, next: NextFunction) => {
    const { boardId, paintingId } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(boardId) ||
      !mongoose.Types.ObjectId.isValid(paintingId)
    ) {
      return next(new ApiError(400, "Invalid Board or painting Id"));
    }

    const board = await Board.findById(boardId);
    if (!board) return next(new ApiError(400, "Board not found"));

    board.paintings = board.paintings.filter(
      (id) => id.toString() !== paintingId
    );
    await board.save();

    res
      .status(200)
      .json(new ApiResponse(200, "Painting removed from the board", board));
  }
);

// Delete a board & Remove from User Model
export const deleteBoard = AsyncHandler(
  async (req: ReqAuth, res: Response, next: NextFunction) => {
    const { boardId } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(boardId))
      return next(new ApiError(400, "Invalid Board Id"));

    const board = await Board.findById(boardId);
    if (!board) return next(new ApiError(400, "Board not found"));

    if (board.user.toString() !== userId?.toString()) {
      return next(
        new ApiError(403, "You do not have the permission to delete Board")
      );
    }

    await Board.findByIdAndDelete(boardId);

    // Remove board from user's `boards` array
    await User.findByIdAndUpdate(userId, { $pull: { boards: boardId } });

    res
      .status(200)
      .json(new ApiResponse(200, "Board deleted successfully", null));
  }
);
