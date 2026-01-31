import { AuthenticatedRequest } from "../middlewares/auth.js";
import { sql } from "../utils/db.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "../utils/TryCatch.js";

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res, next) => {
  const user = req.user;

  res.json(user)
})

export const getUserProfile = TryCatch(async (req, res, next) => {
  const { userId } = req.params;

  const users = await sql`
        SELECT u.user_id, u.name, u.email, u.phone_number, u.role, u.bio, u.resume, u.resume_public_id, u.profile_pic, u.profile_pic_public_id, u.subscription, 
        COALESCE(ARRAY_AGG(s.name) FILTER (WHERE s.name IS NOT NULL), '{}') AS skills FROM users u 
        LEFT JOIN user_skills us ON us.user_id = u.user_id
        LEFT JOIN skills s ON s.skill_id = us.skill_id
        WHERE u.user_id = ${userId}
        GROUP BY u.user_id
      `
  if (users.length === 0) {
    throw new ErrorHandler(404, "User not found")
  }

  const user = users[0]

  res.json(user)
})

export const updateUserProfile = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    if (!user) {
      throw new ErrorHandler(401, "Authentication required")
    }

    const { name, phoneNumber, bio } = req.body;

    const newName = name || user.name
    const newPhoneNumber = phoneNumber || user.phone_number
    const newBio = bio || user.bio

    const [updatedUser] = await sql`
      UPDATE users SET name = ${newName}, phone_number = ${newPhoneNumber}, bio = ${newBio}
      WHERE user_id = ${user.user_id}
      RETURNING user_id, name, email, phone_number, bio
    `

    res.json({
      message: "Profile updated successfully",
      updatedUser
    })
  }
)