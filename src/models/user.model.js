import mongoose from "mongoose";
import authPlugin from "./plugins/auth.plugins.js";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        purchasedCourses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
            },
        ],
    },
    {
        timestamps: true,
    }
);

// password, refreshToken, hashing hook aur token methods plugin se aate hain
userSchema.plugin(authPlugin);

export const User = mongoose.model("User", userSchema);