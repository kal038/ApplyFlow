import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { AuthRequest, AuthUser } from "../types";
import { findUserByEmail, createUser } from "../services/userService";
import { signToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";

// Have to define the async function outside of the handler or Express will scream
// In Express, handlers are expected to be synchronous, and if you use async/await directly in the handler, it won't be able to catch errors properly.
// That said, you can still have it with this trick
const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (await findUserByEmail(email)) {
      return res.status(409).json({ message: "Email taken" });
    }
    // 1. Full User from DB
    const user = await createUser(email, password);
    // 2. Narrowing: pick only safe fields for payload to be stuffed into JWT
    const authUser: AuthUser = {
      user_id: user.user_id,
      email: user.email,
    };
    // 3. Sign the minimal AuthUser
    const token = signToken(authUser);
    res.cookie("jwt", token, { httpOnly: true });
    res.status(201).json({ user_id: user.user_id, email: user.email });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export function signupHandler(req: Request, res: Response) {
  signUp(req, res);
}

export function loginHandler(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("local", (err: any, user: any, info: any) => {
    if (err || !user) return res.status(401).json({ message: info?.message });
    const token = signToken(user);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.json(user);
  })(req, res, next);
}

export function logoutHandler(_req: Request, res: Response) {
  res.clearCookie("jwt");
  res.sendStatus(204);
}

export function meHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const authUser: AuthUser = req.user as AuthUser;
    if (!authUser) {
      throw new AppError("Unauthorized", 401);
    }
    res.json(authUser);
  } catch (error) {
    next(error); // Pass the error to the next middleware (error handler)
  }
}
