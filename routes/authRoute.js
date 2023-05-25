import express from "express";
import { login, logout, register, userProfile } from "../controllers/authController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get('/profile', isAuthenticated, userProfile);

export default router;
