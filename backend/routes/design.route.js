import { Router } from "express";
import multer from 'multer'
import { deleteDesign, getAllDesign, getDesign, postDesign, putDesign } from "../controllers/design.controller.js";
import { objectify } from "../middlewares/objectify.js";

const upload = multer({ dest: 'temp-uploads'});
const router = Router();

router.get('/', getAllDesign);
router.get('/:id', getDesign);
router.post('/', upload.array("files", 5), objectify, postDesign);
router.delete('/:id', deleteDesign);
router.put('/:id', putDesign);

export default router;