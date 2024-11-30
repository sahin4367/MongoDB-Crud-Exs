import Joi from "joi"
import bcrypt from "bcrypt"
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import { appConfig } from "../consts.js"

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: appConfig.EMAIL,
        pass: appConfig.EMAIL_PASSWORD,
    },
});

const register = async (req, res, next) => {
    // 1. validation
    const validData = await Joi.object({
        fullname: Joi.string().trim().min(3).max(50).required(),
        email: Joi.string().trim().email().required(),
        password: Joi.string().trim().min(6).max(16).required(),
        confirm_password: Joi.ref("password")
    })
        .validateAsync(req.body, { abortEarly: false })
        .catch(err => {
            console.log("err", err);
            const errorList = err.details.map(item => item.message);
            return res.status(422).json({
                message: "Validasiya xetasi bash verdi!",
                error: errorList
            })
        })

    const existsUser = await User.findOne({
        email: validData.email
    })
    if (existsUser) {
        return res.json({
            message: `${validData.email} - sistemde movcuddur!`
        })
    }

    // 2. hash password
    validData.password = await bcrypt.hash(validData.password, 10)

    // 3. complete register
    const newUser = await User.create(validData)
    res.status(201).json(newUser)
}

const login = async (req, res, next) => {
    // 1. validate
    const validData = await Joi.object({
        email: Joi.string().trim().email().required(),
        password: Joi.string().trim().min(6).max(16).required(),
    }).validateAsync(req.body, { abortEarly: false })
        .catch(err => {
            return res.status(422).json({
                message: "Xeta bash verdi!",
                error: err.details.map(item => item.message)
            })
        })

    // 2. find user
    const user = await User.findOne({
        email: validData.email,
    })
    if (!user) {
        return res.status(401).json({
            message: "Email ve ya shifre sehvdir!"
        })
    }

    // 3. Check password
    const isValidPassword = await bcrypt.compare(validData.password, user.password)
    if (!isValidPassword) {
        return res.status(401).json({
            message: "Email ve ya shifre sehvdir!"
        })
    }

    const jwt_payload = {
        sub: user._id,
    }

    // 4. create jwt_token
    const new_token = jwt.sign(jwt_payload, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "1d"
    })

    // jwt.verify("asdasdas", process.env.JWT_SECRET)

    res.json({
        access_token: new_token,
    })
}

const verifyEmail = async (req, res, next) => {
    const user = req.user;

    const mailOptions = {
        from: appConfig.EMAIL,
        to: req.user.email,
        subject: "Hello from Div Mongo Blog",
        text: "Please Verify your Email address",
    };

    // console.log("mailOptions", mailOptions);

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email: ", error);
            return res.status(500).json({
                message: error.message,
                error,
            })
        } else {
            console.log("Email sent: ", info);
            return res.json({ message: "Check your email" })
        }
    });
}

export const AuthContoller = () => ({
    login,
    register,
    verifyEmail,
})