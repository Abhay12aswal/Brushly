import mongoose, { Document } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";


export interface IUser extends Document{
    username: string;
    email: string;
    password: string;
    avatar?: string;
    bio?: string;
    savedPaintings: mongoose.Types.ObjectId[];
    boards: mongoose.Types.ObjectId[];
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true,"Please enter your name"],
    trim: true,
  },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        validate: [validator.isEmail, "Please enter a valid email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [6, "Password must be at least 6 characters long"],
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/dxkufsejm/image/upload/v1633134094/avatar/avatar_cugy8z.png",
    },
    bio: {
        type: String,
        default: "",
    },
    savedPaintings: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Painting",
        },
    ],
    boards: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Board",
        },
    ],
}, {
    timestamps: true,
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) { next(); }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();

}
);


const User = mongoose.model<IUser>("User", userSchema);

