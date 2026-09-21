import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "completed",
        },
    },
    {
        timestamps: true,
    }
);

// DB-level guarantee: ek user ek course sirf EK baar kharid sakta hai
purchaseSchema.index({ user: 1, course: 1 }, { unique: true });

export const Purchase = mongoose.model("Purchase", purchaseSchema);