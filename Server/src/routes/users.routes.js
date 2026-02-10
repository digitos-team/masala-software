import express from "express";
import { registerUser, loginUser, logoutUser, getDistributors, getRetailers } from "../controllers/user.controller.js";
import { verifyjwt, isAdmin } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyjwt, logoutUser);
router.route("/distributors").get(verifyjwt, isAdmin, getDistributors);
router.route("/retailers").get(verifyjwt, isAdmin, getRetailers);

export default router;