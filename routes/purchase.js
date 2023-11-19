import express from 'express';
import { isAuthenticated } from "../middlewares/auth.js";
import { purchasepremium,updateTransactionStatus } from '../controllers/purchase.js';

const router = express.Router();

router.get('/premiummembership', isAuthenticated, purchasepremium);

router.post('/updatetransactionstatus', isAuthenticated, updateTransactionStatus);

export default router;