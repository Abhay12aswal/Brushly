// registerUser – Register a new user.

import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// loginUser – Authenticate user and return a token.

// getUserProfile – Get user details.

// updateUserProfile – Update user profile (avatar, bio, etc.).

// savePainting – Save a painting to the user's collection.

// unsavePainting – Remove a painting from saved collection.

export const register = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      throw new ApiError(400, "please enter all details");
    }

    //check if user exists
    const user = await User.findOne({ email });
    if (user) {
      throw new ApiError(400, "User already existe");
    }

    //profile photo

    //create user
    const newUser = await User.create({
      username,
      email,
      password,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, "User created successfully", null));
  }
);

export const login = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "please enter all details");
    }

    //check if user exists
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new ApiError(400, "User does not exist");
    }

    //check if password is correct
    const passCheck = await bcrypt.compare(password, user.password);

    if (!passCheck) {
      throw new ApiError(400, "Incorrect password");
    }

    const tokenData = {
      userId: user._id,
    };

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json(new ApiResponse(200, "User logged in successfully", null));
  }
);

export const logOut = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("logout")
    res.clearCookie("token");
    return res
      .status(200)
      .json(new ApiResponse(200, "User logged out successfully", null));
  }
);

interface AuthRequest extends Request {
  user?: { _id: string };
}

export const getUserProfile = AsyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(400, "User not found");
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new ApiError(400, "User not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "User profile fetched successfully", user));
  }
);

export const updateProfile = AsyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(400, "User not found");
    }

    const { username, email, bio } = req.body;

    if (!username || !email || !bio) {
      throw new ApiError(400, "please enter all details");
    }

    // profile photo

    const user = await User.findByIdAndUpdate(
      userId,
      {
        username,
        email,
        bio,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      throw new ApiError(400, "User not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "User profile updated successfully", user));
  }
);
