import jwt from "jsonwebtoken";
import { AuthUser } from "../types";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable must be set.");
}
const EXPIRATION_TIME = "1h"; // Token expiration time

// JWT is just a string, generated with a secret and a payload
// The payload is the data we want to store in the token
// The secret is used to sign the token, and verify it later
// jwt library does all the heavy lifting for us
//AuthUser → signToken (login/signup) → JWT (stuffed, encoded payload)
//JWT → verifyToken(on a request from frontend) → AuthUser (recovered payload into a trusable object)
/*
1	Frontend calls signs up or logs in
2	Backend calls signToken(user) → JWT created
3	JWT is stuffed into Http cookie, stored in browser
4	Frontend sends JWT cookie on every future request
5	Backend calls verifyToken(token) on each protected route
6	If valid, request passes → req.user populated -> scoped data returned to frontend -> frontend displays
7	If invalid, 401 Unauthorized sent back
*/

export const signToken = (user: AuthUser): string => {
  return jwt.sign({ user_id: user.user_id, email: user.email }, JWT_SECRET, {
    expiresIn: EXPIRATION_TIME,
  });
};

// don't need because passport does this for us
// export const verifyToken = (token: string): AuthUser => {
//   return jwt.verify(token, SECRET) as AuthUser;
// };
