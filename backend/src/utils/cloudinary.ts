import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadCloudinary = async (avatarLocalPath: string) => {
  try {
    if (!avatarLocalPath) return null;
    const response = await cloudinary.uploader.upload(avatarLocalPath, {
      resource_type: "auto",
    });

    fs.unlinkSync(avatarLocalPath);
    return response;
  } catch (error) {
    return null;
  }
};
