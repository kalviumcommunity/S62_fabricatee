import { Router } from "express";
import { userLogin, refreshToken, logOut} from "../controllers/users.controller.js";
import { loginLimiter } from "../middlewares/loginLimiter.js";

const router = Router();

router.post('/login', loginLimiter, userLogin);
router.get('/logout', logOut);
router.get('/refresh', refreshToken);

export default router;