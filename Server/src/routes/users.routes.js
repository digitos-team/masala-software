import express from "express";
import { registerUser, loginUser, logoutUser, getDistributors, getRetailers } from "../controllers/user.controller.js";
import { verifyjwt, isAdmin } from "../middlewares/auth.middlewares.js";
import { registerUser, loginUser, logoutUser, getDistributors, deleteUser, updateUser, updatePassword } from "../controllers/user.controller.js";
import { verifyjwt } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyjwt, logoutUser);
router.route("/distributors").get(verifyjwt, isAdmin, getDistributors);
router.route("/retailers").get(verifyjwt, isAdmin, getRetailers);
router.route("/distributors").get(verifyjwt, getDistributors);
router.route("/delete/:id").delete(verifyjwt, deleteUser);
router.route("/update/:id").patch(verifyjwt, updateUser);
router.route("/update-password/:id").patch(verifyjwt, updatePassword);

export default router;