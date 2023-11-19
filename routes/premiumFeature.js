import express from "express";
import getUserLeaderBoard from "../controllers/premium.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();
router.get('/showleaderboard',  isAuthenticated, getUserLeaderBoard);

export default router;  