import { Router } from "express";
import { createOrder, deleteOrder, getAllOrders, getOrder, postOrder, putOrder, verifyPayment } from "../controllers/order.controller.js";

const router = Router();

router.get('/', getAllOrders);
router.get('/:id', getOrder);
router.post('/', postOrder);
router.delete('/:id', deleteOrder);
router.put('/:id', putOrder);
router.post('/create', createOrder);
router.post('/verify', verifyPayment);

export default router;