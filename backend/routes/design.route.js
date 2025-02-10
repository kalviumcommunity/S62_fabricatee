import { Router } from "express";
import multer from "multer";
import {
  deleteDesign,
  getAllDesign,
  getDesign,
  postDesign,
  putDesign,
} from "../controllers/design.controller.js";
import { objectify } from "../middlewares/objectify.js";
import {
  authenticateToken,
  authorizeRole,
} from "../middlewares/userAuthenticateJWT.js";

const upload = multer({ dest: "temp-uploads" });
const router = Router();

router.get("/", getAllDesign);
router.get("/:id", getDesign);
router.post(
  "/",
  authenticateToken,
  authorizeRole("admin", "user"),
  upload.array("files", 5),
  objectify,
  postDesign
);
router.put(
  "/:id",
  authenticateToken,
  authorizeRole("admin"),
  upload.array("files", 5),
  objectify,
  putDesign
);
router.delete("/:id", authenticateToken, authorizeRole("admin"), deleteDesign);

export default router;
