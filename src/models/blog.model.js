import mongoose from "mongoose";

const schema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        trim: true,
    },
    description: {
        type: String,
        require: true,
        trim: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        require: true,
    },
    img_path : {
        type : String,
        required : true,
    }
    
})

export const Blog = mongoose.model("Blog", schema);