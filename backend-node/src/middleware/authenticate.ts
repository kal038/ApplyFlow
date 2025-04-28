import passport from "../config/passport";

// middleware factory, returns a middleware function that authenticates requests
export const authenticateJWT = passport.authenticate("jwt", { session: false });
