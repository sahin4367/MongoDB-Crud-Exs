import { Router } from "express"
import { BlogController } from "../controllers/blog.controller.js"
import { useAuth } from "../middlewares/auth.middleware.js"
import multer from "multer";
import { appConfig } from "../consts.js";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename)
    }
})

const upload = multer({
    storage,
    fileFilter: (_, file, cb) => {    
        if (appConfig.allowedImageTypes.indexOf(file.mimetype) !== -1) {
            cb(null, true)
        } else {
            cb(new Error("File type must be jpeg or png"), false)
        }
    }
})



export const blogRoutes = Router()
const controller = BlogController()

// -> /api/blog/create
blogRoutes.post(
    "/create",
    upload.array("images", 5),//blogun daxilinde 5 sekil elave etsek 
    useAuth,
    controller.create
);
// -> /api/blog/list
blogRoutes.get("/list",controller.getList)
// -> /api/blog/123
blogRoutes.get("/:id", useAuth ,controller.getById)

//delete : 
blogRoutes.delete("/:id", useAuth ,controller.deleteById)
//update : 
blogRoutes.put('/:id',useAuth , controller.updateById)