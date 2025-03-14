import { Router } from "express";
import {
  getAllUser,
  getUser,
  postUser,
  deleteUser,
  putUser,
} from "../controllers/users.controller.js";
import { upload } from "../middlewares/multer.js";
import {
  authenticateToken,
  authorizeRole,
} from "../middlewares/userAuthenticateJWT.js";

const router = Router();

router.post("/", postUser);
router.get("/", getAllUser);
router.get("/:id", getUser);
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole("user", "admin"),
  deleteUser
);
router.put("/:id", upload.single("profile"), putUser);

export default router;
