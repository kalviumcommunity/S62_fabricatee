import { Router } from "express";
import { deleteFabric, getAllFabric, getFabric, postFabric, putFabric } from "../controllers/fabric.controller.js";

const router = Router();

router.get('/', getAllFabric);
router.get('/:id', getFabric);
router.post('/', postFabric);
router.delete('/:id', deleteFabric);
router.put('/:id', putFabric);

export default router;