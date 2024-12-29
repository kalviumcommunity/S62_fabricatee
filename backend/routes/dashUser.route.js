import { Router } from "express";
import { getAllUser, getUser, postUser, deleteUser, putUser} from "../controllers/dashUser.controller.js";

const router = Router();

router.get('/', getAllUser);
router.get('/:id', getUser);
router.post('/', postUser);
router.delete('/:id', deleteUser);
router.put('/:id', putUser);

export default router;