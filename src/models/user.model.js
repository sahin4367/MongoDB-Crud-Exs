import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    isVerifiedEmail: {
        type: Boolean,
        default: null,
    },
    code_expired_at: {
        type: Date,
    },
    verifyCode: {
        type: Number,
    },
    // uiid: {
    // },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    refresh_token: {
        type: String,
        trim: true,
    },
    // one-to-many
    blogs: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Blog"
        }
    ]
})

export const User = mongoose.model("User", userSchema)