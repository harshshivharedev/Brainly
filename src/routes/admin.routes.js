
import { Router } from "express";

import { registerAdmin, loginAdmin, logoutAdmin } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/adminAuth.middleware.js";

const router = Router();

router.route("/register").post(registerAdmin);
router.route("/login").post(loginAdmin);
router.route("/logout").post(verifyJWT, logoutAdmin);

export default router;