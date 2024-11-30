import Joi from "joi"
import { Blog } from "../models/blog.model.js"
import jwt from "jsonwebtoken";
import { appConfig } from "../consts.js";
import { User } from "../models/user.model.js";

const create = async (req, res, next) => {

    res.json({ user: req.user })

    // const { title, description } = await Joi.object({
    //     title: Joi.string().trim().min(3).max(50).required(),
    //     description: Joi.string().trim().min(10).max(1000).required(),
    // }).validateAsync(req.body, { abortEarly: false })
    //     .catch(err => {
    //         return res.status(422).json({
    //             message: "Xeta bash verdi!",
    //             error: err.details.map(item => item.message)
    //         })
    //     })

    // await Blog.create({
    //     title,
    //     description,
    //     // user: user._id,
    // })
    //     .then(newBlog => res.status(201).json(newBlog))
    //     .catch(error => res.status(500).json({
    //         message: "Xeta bash verdi!",
    //         error,
    //     }))
}

export const BlogController = () => ({
    create,
})