import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AsyncHandler } from '../utils/AsyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { User } from '../models/user.models.js';


// Define User Interface
interface IUser {
  _id: string;
  username: string;
  email: string;
}

// Extend Request type to include `user`  
interface AuthRequest extends Request {
  user?: IUser;
}

export const JWTverify = AsyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;

    if (!token) {
      return next(new ApiError(401,"please login first"));
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId: string;
      };

      const user = await User.findById(decodedToken.userId).select('-password');
      if (!user) {
        return next(new ApiError(404,"user not found"));
      }

      req.user = user as IUser; // Type assertion to IUser
      next();
    } catch (error) {
      return next(new ApiError(401,"Invalid token"));
    }
  }
);
