import express from "express";
import authController from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", authController.register);
router.post("/signin", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refresh);

export default router;
