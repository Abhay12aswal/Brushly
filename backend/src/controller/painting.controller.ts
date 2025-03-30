// uploadPainting – Upload a new painting.

import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { Painting } from "../models/painting.models.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";


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
        };

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

export const getAllPaintings = AsyncHandler(async(req: Request, res: Response, next: NextFunction)=>{

    const painting = await Painting.find({});

    return res.status(200).json(new ApiResponse(200,"Painting fetched", painting))
})


// getPaintingById – Fetch details of a single painting.

export const getPaintingById = AsyncHandler(async(req: Request, res:Response, next: NextFunction )=>{


    const id = req.params.id;

    const painting  = await Painting.findById(id);

    if(!painting){
        throw new ApiError(400,"Painting not found")
    }

    return res.status(200).json(new ApiResponse(200,"Painting found",painting))

})


// get admin paintings (single user all painting)
export const getUserPaintings = AsyncHandler(
    async (req: reqAuth, res: Response, next: NextFunction) => {
      const userId = req.user?._id; // Logged-in user's ID
  
      if (!userId) {
        throw new ApiError(401, "Unauthorized: User not found");
      }
  
      const paintings = await Painting.find({ artist: userId }) // Fetch paintings by user
        .populate("artist", "username email") // Populate artist details
        .sort({ createdAt: -1 }); // Sort newest first
  
      if (!paintings.length) {
        throw new ApiError(404, "No paintings found for this user");
      }
  
      return res
        .status(200)
        .json(new ApiResponse(200, "User paintings fetched successfully", paintings));
    }
  );

//upadtePainting – Allow artist to update their own painting.

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

// unlikePainting – Allow users to remove their like.

// deletePainting – Allow artist to delete their own painting.
