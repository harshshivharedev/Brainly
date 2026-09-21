
import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,

    },
    price : {
        type : Number,
        required : true,

    },
    creatorId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Admin"
    }
})

export const Course = mongoose.model("Course", courseSchema)