import { Router, Request, Response } from "express";
import {
  signupHandler,
  loginHandler,
  logoutHandler,
  meHandler,
} from "../controllers/authController";
import { authenticateJWT } from "../middleware/authenticate";

const router = Router();

router.post("/signup", signupHandler);
router.post("/login", loginHandler);
router.post("/logout", logoutHandler);
router.get("/me", authenticateJWT, meHandler);

export default router;
