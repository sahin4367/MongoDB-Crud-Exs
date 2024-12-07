import Joi from "joi"
import bcrypt from "bcrypt"
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import { appConfig } from "../consts.js"
import moment from "moment"

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
    console.log("user", user);

    // check user.isEmailVerified
    if (user.isVerifiedEmail) return res.json({ message: "Email is already verified" })

    // create random code with 6 digits
    const randomCode = Math.floor(100000 + Math.random() * 999999);
    // get current date and add 5 minutes
    // const code_expired_at = new Date(Date.now() + appConfig.verifyCodeExpiteMinute * 60 * 1000);
    const code_expired_at = moment().add(appConfig.verifyCodeExpiteMinute, "minutes")

    user.code_expired_at = code_expired_at
    user.verifyCode = randomCode

    await user.save();

    const mailOptions = {
        from: appConfig.EMAIL,
        to: req.user.email,
        subject: 'Email Verification',
        text: `Your verification code is: ${randomCode}`,
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
            // rabbit mq
            return res.json({
                message: `Verification code sent to your email.
                It will expire in ${appConfig.verifyCodeExpiteMinute} minutes.`
            })
        }
    });
}

const checkEmailCode = async (req, res, next) => {
    // const currentDate = new Date();
    // const formattedDate = moment(currentDate).format("DD.MM.YYYY HH:mm")

    try {
        const validData = await Joi.object({
            code: Joi.string()
                .length(6)
                .regex(/^[0-9]+$/)
                .required()
            // .messages({
            //     "object.regex": "Must have at least 8 characters",
            // }),
        }).validateAsync(req.body, { abortEarly: false })

        const user = req.user;
        if (!user.verifyCode) {
            return res.status(400).json({
                message: "Verification code not found!"
            })
        }

        // check expired date
        if (user.code_expired_at < new Date()) {
            return res.status(400).json({
                message: "Verification code is expired!"
            })
        }

        // +validData.code -> 123456
        if (user.verifyCode !== Number(validData.code)) {
            return res.status(400).json({
                message: "Verification code is incorrect!"
            })
        }

        user.isVerifiedEmail = true;
        user.verifyCode = null;
        user.code_expired_at = null;

        await user.save();

        return res.json({
            message: "Email verified successfully!"
        })

    } catch (error) {
        console.error("Error: ", error);
        res.status(500).json({
            message: error.message,
            error,
        })
    }
}

export const AuthContoller = () => ({
    login,
    register,
    verifyEmail,
    checkEmailCode
})