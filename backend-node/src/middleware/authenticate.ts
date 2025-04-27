import passport from "../config/passport";

export const authenticateJWT = passport.authenticate("jwt", { session: false });
