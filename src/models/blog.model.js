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
        
    }
})

export const Blog = mongoose.model("Blog", schema);