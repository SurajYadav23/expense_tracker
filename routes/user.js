import express from 'express';
import { register, login } from '../controllers/user.js'
import { isAuthenticated } from '../middlewares/auth.js';
import { addExpense,getexpenses,deleteexpense,downloadExpenses } from '../controllers/expense.js';



const router = express.Router();
  
router.post('/signup', register);
router.post('/login', login);
router.post('/addexpense', isAuthenticated, addExpense )

router.get('/download', isAuthenticated, downloadExpenses)

router.get('/getexpenses',isAuthenticated, getexpenses )

router.delete('/deleteexpense/:expenseid', isAuthenticated, deleteexpense)



export default router;
