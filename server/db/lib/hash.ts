import * as jwt from "jsonwebtoken";

import { JWT_SECRET } from "../config";

export function encodeJWT(data) {
  return jwt.sign(data, JWT_SECRET);
}

export function decodeJWT(token) {
  return jwt.verify(token, JWT_SECRET);
}
