import express from "express";
import { registerUser, loginUser, logoutUser, getDistributors } from "../controllers/user.controller.js";
import { verifyjwt } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyjwt, logoutUser);
router.route("/distributors").get(verifyjwt, getDistributors);

export default router;