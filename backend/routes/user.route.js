import { Router } from "express";
import { getAllUser, getUser, postUser, deleteUser, putUser, userLogin, refreshToken} from "../controllers/users.controller.js";
import { upload } from "../middlewares/multer.js";
import { loginLimiter } from "../middlewares/loginLimiter.js";

const router = Router();

router.post('/', postUser);
router.get('/', getAllUser);
router.get('/:id', getUser);
router.delete('/:id', deleteUser);
router.put('/:id', putUser);

export default router;