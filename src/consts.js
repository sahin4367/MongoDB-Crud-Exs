export const appConfig = {
    port: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    EMAIL: process.env.USER_EMAIL,
    EMAIL_PASSWORD: process.env.USER_PASSWORD,
    verifyCodeExpiteMinute: 3,
    clientBaseUrl: "https://www.tap.az/verify?token=${uuidToken}",
    allowedImageTypes: ["image/jpg", "image/jpeg", "image/png"],
}