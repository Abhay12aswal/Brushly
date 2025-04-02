// uploadPainting – Upload a new painting.

import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { Painting } from "../models/painting.models.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { User } from "../models/user.models.js";

interface reqAuth extends Request {
  user: {
    _id: string;
  };
}

export const uploadPainting = AsyncHandler(
  async (req: reqAuth, res: Response, next: NextFunction) => {
    const { title, description, categories } = req.body;

    if (!title || !description || !categories) {
      throw new ApiError(400, "Please provide all the fields");
    }

    const imageUrlLocalpath = req.file?.path;

    if (!imageUrlLocalpath) {
      throw new ApiError(400, "Please upload an image");
    }

    const imageUrl = await uploadCloudinary(imageUrlLocalpath);

    if (!imageUrl || !imageUrl.url) {
      throw new ApiError(400, "Error uploading image");
    }

    const painting = await Painting.create({
      title,
      description,
      categories,
      image: imageUrl.url,
      artist: req.user?._id,
    });

    if (!painting) {
      throw new ApiError(400, "Error creating painting");
    }

    return res
      .status(201)
      .json(new ApiResponse(200, "Painting created successfully", painting));
  }
);

// getAllPaintings – Fetch all paintings (for the explore page).

export const getAllPaintings = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const painting = await Painting.find({});

    return res
      .status(200)
      .json(new ApiResponse(200, "Painting fetched", painting));
  }
);

// getPaintingById – Fetch details of a single painting.

export const getPaintingById = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const painting = await Painting.findById(id);

    if (!painting) {
      throw new ApiError(400, "Painting not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Painting found", painting));
  }
);

// get admin paintings (single user all painting)
export const getUserPaintings = AsyncHandler(
  async (req: reqAuth, res: Response, next: NextFunction) => {
    const userId = req.user?._id; // Logged-in user's ID

    if (!userId) {
      throw new ApiError(401, "Unauthorized: User not found");
    }

    const paintings = await Painting.find({ artist: userId }) // Fetch paintings by user
      .populate("artist", "username email")
      .populate("comments", "text") // Populate artist details
      .sort({ createdAt: -1 }); // Sort newest first

    if (!paintings.length) {
      throw new ApiError(404, "No paintings found for this user");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, "User paintings fetched successfully", paintings)
      );
  }
);

//upadtePainting – Allow artist to update their own painting.

export const updatePainting = AsyncHandler(
  async (req: reqAuth, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user?._id;
    const { title, description, categories } = req.body;

    // Check if painting exists
    const painting = await Painting.findById(id);
    if (!painting) {
      throw new ApiError(404, "Painting not found");
    }

    // Check if the user is the owner of the painting
    if (painting.artist.toString() !== userId.toString()) {
      throw new ApiError(403, "You are not the owner of this painting");
    }

    let updateData: Partial<Record<string, any>> = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (categories) updateData.categories = categories;

    if (req.file?.path) {
      const image = await uploadCloudinary(req.file.path);
      if (!image?.url) {
        throw new ApiError(400, "Error uploading image");
      }
      updateData.image = image.url;
    }

    if (Object.keys(updateData).length === 0) {
      throw new ApiError(400, "Please provide at least one field to update");
    }

    // Update the painting
    const updatedPainting = await Painting.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("artist", "username email");

    if (!updatedPainting) {
      throw new ApiError(500, "Error updating painting");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Painting updated successfully", updatedPainting)
      );
  }
);

//getcategory
// export const getPaintingsByCategory = AsyncHandler(
//     async (req: Request, res: Response, next: NextFunction) => {
//       const { category } = req.query;

//       if (!category) {
//         throw new ApiError(400, "Category is required");
//       }

//       const paintings = await Painting.find({ categories: category })
//         .populate("artist", "username") // Populate artist details
//         .populate("likes") // Optional: Populate likes
//         .populate("comments") // Optional: Populate comments
//         .sort({ createdAt: -1 }); // Sort by newest first

//       if (!paintings.length) {
//         throw new ApiError(404, "No paintings found in this category");
//       }

//       return res
//         .status(200)
//         .json(new ApiResponse(200, "Paintings fetched successfully", paintings));
//     }
//   );

// likePainting – Allow users to like a painting.
export const likeUnlikePainting = AsyncHandler(
  async (req: reqAuth, res: Response, next: NextFunction) => {
    const userId = req.user?._id; // Convert to ObjectId
    const { paintingId } = req.params;

    if (!paintingId) {
      throw new ApiError(401, "Painting Id is required");
    }

    const painting = await Painting.findById(paintingId);
    if (!painting) {
      throw new ApiError(404, "Painting not found");
    }


    //@ts-ignore
    const alreadyLiked = painting.likes.includes(userId);

    if (alreadyLiked) {
      //remove like
      painting.likes = painting.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      //like
      //@ts-ignore
      painting.likes.push(userId);
    }

    await painting.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          alreadyLiked
            ? "Painting unliked successfully"
            : "painting liked successfully",
          painting
        )
      );
  }
);

// deletePainting – Allow artist to delete their own painting.

export const deletePainting = AsyncHandler(
  async (req: reqAuth, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const { paintingId } = req.params;

    const findPainting = await Painting.findById(paintingId);

    if (!findPainting) {
      throw new ApiError(400, "Painting not found");
    }

    if (findPainting.artist.toString() !== userId.toString()) {
      throw new ApiError(400, "You are not the owner of the painting");
    }

    const painting = await Painting.findByIdAndDelete(paintingId);
    return res
      .status(200)
      .json(new ApiResponse(200, "painting deleted successfully", painting));
  }
);


export const saveUnsavePainting = AsyncHandler(async (req: reqAuth, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  const { paintingId } = req.params;


  if (!mongoose.Types.ObjectId.isValid(paintingId)) {
      throw new ApiError(400, "Invalid painting ID");
  }

  const user = await User.findById(userId);
  if (!user) {
      throw new ApiError(404, "User not found");
  }

  const painting = await Painting.findById(paintingId);
  if (!painting) {
      throw new ApiError(404, "Painting not found");
  }

  // Check if painting is already saved
  const isSaved = user.savedPaintings.some((id) => id.toString() === paintingId);

  if (isSaved) {
      // Unsave (Remove from savedPaintings)
      user.savedPaintings = user.savedPaintings.filter((id) => id.toString() !== paintingId);
      await user.save();
      return res.status(200).json(new ApiResponse(200, "Painting unsaved successfully", user.savedPaintings));
  } else {
      // Save (Add to savedPaintings)
      user.savedPaintings.push(new mongoose.Types.ObjectId(paintingId));
      (await user.save());
      return res.status(200).json(new ApiResponse(200, "Painting saved successfully", user.savedPaintings));
  }
});
