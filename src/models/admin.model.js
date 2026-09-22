import mongoose from "mongoose";
import authPlugin from "./plugins/auth.plugins.js";

const adminSchema = new mongoose.Schema(
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
    },
    {
        timestamps: true,
    }
);

adminSchema.plugin(authPlugin);

export const Admin = mongoose.model("Admin", adminSchema);