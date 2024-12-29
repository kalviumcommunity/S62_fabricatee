import { Router } from "express";
import { deleteDesign, getAllDesign, getDesign, postDesign, putDesign } from "../controllers/design.controller.js";

const router = Router();

router.get('/', getAllDesign);
router.get('/:id', getDesign);
router.post('/', postDesign);
router.delete('/:id', deleteDesign);
router.put('/:id', putDesign);

export default router;