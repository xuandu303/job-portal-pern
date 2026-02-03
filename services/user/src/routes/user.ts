import express from "express"
import { addSkillToUser, deleteSkillFromUser, getUserProfile, myProfile, updateProfilePic, updateResume, updateUserProfile } from "../controllers/user.js"
import { isAuth } from "../middlewares/auth.js"
import uploadFile from "../middlewares/multer.js"

const router = express.Router()

router.get("/me", isAuth, myProfile)
router.get("/:userId", getUserProfile)
router.put("/update/profile", isAuth, updateUserProfile)
router.put("/update/pic", isAuth, uploadFile, updateProfilePic)
router.put("/update/resume", isAuth, uploadFile, updateResume)
router.post("/skill/add", isAuth, addSkillToUser)
router.delete("/skill/delete", isAuth, deleteSkillFromUser)

export default router