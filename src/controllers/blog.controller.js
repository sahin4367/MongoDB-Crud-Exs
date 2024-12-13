import Joi from "joi"
import { Blog } from "../models/blog.model.js"
import jwt from "jsonwebtoken";
import { appConfig } from "../consts.js";
import { User } from "../models/user.model.js";
import req from "express/lib/request.js";

const create = async (req, res, next) => {
    const user = req.user;
    console.log(user);
    
    if (!user.isVerifiedEmail) return res.status(400).json({
        message: "User email not verified!",
    })

    const { title, description } = await Joi.object({
        title: Joi.string().trim().min(3).max(50).required(),
        description: Joi.string().trim().min(10).max(1000).required(),
    }).validateAsync(req.body, { abortEarly: false })
        .catch(err => {
            return res.status(422).json({
                message: "Xeta bash verdi!",
                error: err.details.map(item => item.message)
            })
        })

    await Blog.create({
        title,
        description,
        user: user.id,
    })
        .then(newBlog => res.status(201).json(newBlog))
        .catch(error => res.status(500).json({
            message: "Xeta bash verdi!",
            error,
        }))
}

const getList = async (req, res, next) => {
    try {
        const list = await Blog.find().populate("user", "fullname").select("_id title user")

        // res.json(list.map(item => {
        //     return {
        //         id: item._id,
        //         ...item._doc,
        //         _id: undefined,
        //     }
        // }))

        res.json(list)
    } catch (error) {
        res.json({
            message: "Xeta bash Verdi!",
            error,
        })
    }
}

const getById = async (req, res, next) => {
    const id = req.params.id;
    if (!id) return res.json({
        message: "Id required",
    })
    const blog = await Blog.findById(id).populate("user", "fullname")

    res.json(blog)
}

const deleteById = async (req,res,next) => {
    const id = req.params.id;
    if (!id) return res.status(400).json({message : `Id required!`});

    try {
        const deletedBlog = await Blog.findByIdAndDelete(id);
        if (!deletedBlog) {
            return res.status(404).json({message : `Blog not fund!`})
        }
        res.json({message : `Blog delete saccsesfully!` , blog : deletedBlog})
    } catch (error) {
        res.status(500).json({message : "Xeta bas verdi!" , error})
        
    }
}

const updateById = async (req, res, next) => {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "Id required" });

    const { title, description } = await Joi.object({
        title: Joi.string().trim().min(3).max(50),
        description: Joi.string().trim().min(10).max(1000),
    }).validateAsync(req.body, { abortEarly: false })
        .catch(err => {
            return res.status(422).json({
                message: "Validation Error!",
                error: err.details.map(item => item.message),
            });
        });

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            { title, description },
            { new: true, runValidators: true } 
        );

        if (!updatedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.json({ message: "Blog updated successfully", blog: updatedBlog });
    } catch (error) {
        res.status(500).json({ message: "Xeta bash verdi!", error });
    }
};



export const BlogController = () => ({
    create,
    getList,
    getById,
    deleteById,
    updateById,
})