import express from "express";
import { signupController, homeController,signinController, logoutController, homeAdmincontroller } from "../controllers/authController.js";
import { verifyToken, verifyTokenAdmin } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post('/signup',signupController);

router.post('/signin', signinController);

router.post('/logout',logoutController);

router.get('/home', verifyToken, homeController);

router.get('/homeadmin', verifyTokenAdmin , homeAdmincontroller);

export default router;