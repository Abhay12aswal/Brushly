import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { uploadCloudinary } from "../utils/cloudinary.js";

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

    let avatarLocalPath = req.file?.path;
    let avatar

 
    if (avatarLocalPath) {
      const uploadedAvatar = await uploadCloudinary(avatarLocalPath);
      if (!uploadedAvatar || !uploadedAvatar.secure_url) {
        throw new ApiError(400, "Error uploading avatar");
      }
    
      avatar = uploadedAvatar.secure_url; 
    }

    //profile photo

    //create user
    const newUser = await User.create({
      username,
      email,
      password,
      avatar
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
      .json(new ApiResponse(200, "User logged in successfully", user));
  }
);

export const logOut = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("logout");
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

    const user = await User.findById(userId)
      .select("-password")
      .populate("savedPaintings", "title")
      .populate("boards","name");

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

    const avatarLocalPath = req.file?.path;

    let updateData: Record<string, any> = {};

    if (avatarLocalPath) {
      const avatar = await uploadCloudinary(avatarLocalPath);
      if (!avatar || !avatar.url) {
        throw new ApiError(400, "Error uploading image");
      }
      updateData.avatar = avatar.url;
    }

    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (bio) updateData.bio = bio;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      throw new ApiError(400, "User not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "User profile updated successfully", user));
  }
);

// export const followUser = TryCatch(async (req: Request, res: Response) => {
//   const { userId } = req.params; // ID of the user to follow
//   const loggedInUserId = req.user?.id; // ID of logged-in user

//   if (userId === loggedInUserId) {
//     throw new ErrorHandler("You cannot follow yourself", 400);
//   }

//   const userToFollow = await User.findById(userId);
//   const loggedInUser = await User.findById(loggedInUserId);

//   if (!userToFollow || !loggedInUser) {
//     throw new ErrorHandler("User not found", 404);
//   }

//   if (loggedInUser.following.includes(userId)) {
//     throw new ErrorHandler("Already following this user", 400);
//   }

//   // Add userId to following list
//   loggedInUser.following.push(userToFollow._id);
//   // Add loggedInUserId to followers list
//   userToFollow.followers.push(loggedInUser._id);

//   await loggedInUser.save();
//   await userToFollow.save();

//   res.status(200).json({ message: "User followed successfully" });
// });

// /**
//  * Unfollow a user
//  */
// export const unfollowUser = TryCatch(async (req: Request, res: Response) => {
//   const { userId } = req.params;
//   const loggedInUserId = req.user?.id;

//   const userToUnfollow = await User.findById(userId);
//   const loggedInUser = await User.findById(loggedInUserId);

//   if (!userToUnfollow || !loggedInUser) {
//     throw new ErrorHandler("User not found", 404);
//   }

//   if (!loggedInUser.following.includes(userId)) {
//     throw new ErrorHandler("Not following this user", 400);
//   }

//   // Remove userId from following list
//   loggedInUser.following = loggedInUser.following.filter(
//     (id) => id.toString() !== userId
//   );

//   // Remove loggedInUserId from followers list
//   userToUnfollow.followers = userToUnfollow.followers.filter(
//     (id) => id.toString() !== loggedInUserId
//   );

//   await loggedInUser.save();
//   await userToUnfollow.save();

//   res.status(200).json({ message: "User unfollowed successfully" });
// });

// /**
//  * Get a user's followers
//  */
// export const getFollowers = TryCatch(async (req: Request, res: Response) => {
//   const { userId } = req.params;

//   const user = await User.findById(userId).populate("followers", "username");

//   if (!user) {
//     throw new ErrorHandler("User not found", 404);
//   }

//   res.status(200).json({ followers: user.followers });
// });

// /**
//  * Get a user's following
//  */
// export const getFollowing = TryCatch(async (req: Request, res: Response) => {
//   const { userId } = req.params;

//   const user = await User.findById(userId).populate("following", "username");

//   if (!user) {
//     throw new ErrorHandler("User not found", 404);
//   }

//   res.status(200).json({ following: user.following });
// });
