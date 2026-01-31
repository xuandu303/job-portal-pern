import express from "express"
import { getUserProfile, myProfile, updateUserProfile } from "../controllers/user.js"
import { isAuth } from "../middlewares/auth.js"

const router = express.Router()

router.get("/me", isAuth, myProfile)
router.get("/:userId", getUserProfile)
router.put("/update/profile", isAuth, updateUserProfile)

export default router