import Joi from "joi"
import { Blog } from "../models/blog.model.js"
import jwt from "jsonwebtoken";
import { appConfig } from "../consts.js";
import { User } from "../models/user.model.js";

const create = async (req, res, next) => {
    // 1. get Bearer token from req.headers.authorization
    const bearerToken = req.headers.authorization;
    // 2. sptlit Bearer token
    if (!bearerToken) return res.status(401).json({ message: "Unauth" })
    const access_token = req.headers.authorization.split(" ")[1] // [ "Bearer", "asdasda" ]
    if (!access_token) return res.status(401).json({ message: "Unauth" });
    // 3. decode token and get user id
    try {
        const jwtResult = jwt.verify(access_token, appConfig.JWT_SECRET)

        const user = await User.findById(jwtResult.sub);
        if (!user) res.status(404).json({ message: "User not found!" });

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
            user: user._id,
        })
            .then(newBlog => res.status(201).json(newBlog))
            .catch(error => res.status(500).json({
                message: "Xeta bash verdi!",
                error,
            }))

    } catch (error) {
        return res.json({
            message: error.message,
            error,
        })
    }
}

export const BlogController = () => ({
    create,
})