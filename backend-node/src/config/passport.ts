import { User } from "./../types/index";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { AuthUser } from "@/types";
import { findUserByEmail, findUserById } from "../services/userService";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (
      email: string,
      password: string,
      done: (error: any, user?: any, options?: { message: string }) => void
    ) => {
      try {
        const user = await findUserByEmail(email);
        if (!user) return done(null, false, { message: "Unknown email" });
        const match = await bcrypt.compare(
          password,
          (user as User).password_hash
        );
        if (!match) return done(null, false, { message: "Bad password" });
        return done(null, { user_id: user.user_id, email: user.email });
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.jwt]),
      secretOrKey: JWT_SECRET,
    },
    (payload, done) => {
      done(null, {
        user_id: payload.user_id,
        email: payload.email,
      } as AuthUser);
    }
  )
);

export default passport;
