import express from 'express';
import { forgotpassword, resetpassword, updatepassword } from '../controllers/resetpasswordController.js'

const router = express.Router();
router.get('/updatepassword/:resetpasswordid', updatepassword)

router.get('/resetpassword/:id', resetpassword)

router.use('/forgotpassword', forgotpassword)

export default router;  
