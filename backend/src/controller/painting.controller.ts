// uploadPainting – Upload a new painting.

import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { Painting } from "../models/painting.models.js";

export const uploadPainting = AsyncHandler(async (req: Request,res: Response, next: NextFunction)=>{

    const {title , description} = req.body;

    if(!title || !description){
        return new ApiError(400, "Please provide all the fields");
    }


    //check if painting already exists
})

// getAllPaintings – Fetch all paintings (for the explore page).

// getPaintingById – Fetch details of a single painting.

//upadtePainting – Allow artist to update their own painting.

// likePainting – Allow users to like a painting.

// unlikePainting – Allow users to remove their like.

// deletePainting – Allow artist to delete their own painting.
