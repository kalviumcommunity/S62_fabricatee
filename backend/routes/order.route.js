import { Router } from "express";
import { createOrder, deleteOrder, getAllOrders, getOrder, getUserOrders, postOrder, putOrder, verifyPayment } from "../controllers/order.controller.js";
import { authenticateToken, authorizeRole } from "../middlewares/userAuthenticateJWT.js";

const router = Router();

router.get('/all', authenticateToken, authorizeRole('admin'), getAllOrders);
router.get('/', authenticateToken, authorizeRole('user', 'admin'), getUserOrders);
router.get('/:id', getOrder);
router.post('/', postOrder);
router.delete('/:id', deleteOrder);
router.put('/:id', putOrder);
router.post('/create', createOrder);
router.post('/verify', verifyPayment);

export default router;