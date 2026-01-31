import { AuthenticatedRequest } from "../middlewares/auth.js";
import { TryCatch } from "../utils/TryCatch.js";

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res, next) => {
  const user = req.user;

  res.json(user)
})