import express from "express"
import { getUserProfile, myProfile, updateProfilePic, updateResume, updateUserProfile } from "../controllers/user.js"
import { isAuth } from "../middlewares/auth.js"
import uploadFile from "../middlewares/multer.js"

const router = express.Router()

router.get("/me", isAuth, myProfile)
router.get("/:userId", getUserProfile)
router.put("/update/profile", isAuth, updateUserProfile)
router.put("/update/pic", isAuth, uploadFile, updateProfilePic)
router.put("/update/resume", isAuth, uploadFile, updateResume)

export default router