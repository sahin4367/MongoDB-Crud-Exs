export const appConfig = {
    port: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    EMAIL: process.env.EMAIL,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    verifyCodeExpiteMinute: 3,
    clientBaseUrl: "https://www.tap.az/verify?token=${uuidToken}"
}