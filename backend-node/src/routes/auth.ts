import { Router, Request, Response } from "express";
import passport from "passport";
import { signToken } from "../utils/jwt";
import { createUser, findUserByEmail } from "../services/userService";
import { authenticateJWT } from "../middleware/authenticate";

const router = Router();

router.post();

router.post();

router.post();

router.get();

export default router;
