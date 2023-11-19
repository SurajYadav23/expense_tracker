import express from "express";
import { addExpense, getAllExpenses } from '../controllers/expense.js';
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();
router.post('/add',isAuthenticated, addExpense);
router.get('/my',isAuthenticated, getAllExpenses);
export default router;