import { User } from "../models/user.model.js"

const getUserDetailsById = async (req, res, next) => {
    const user = await User.findById(req.params.id).select("_id fullname email isVerifiedEmail")
    res.json(user)
}   

export const UserController = () => ({
    getUserDetailsById,
})