import { Router } from "express";
import { deleteOrder, getAllOrders, getOrder, postOrder, putOrder } from "../controllers/order.controller.js";

const router = Router();

router.get('/', getAllOrders);
router.get('/:id', getOrder);
router.post('/', postOrder);
router.delete('/:id', deleteOrder);
router.put('/:id', putOrder);

export default router;