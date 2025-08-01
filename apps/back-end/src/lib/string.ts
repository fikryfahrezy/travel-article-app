import * as crypto from "node:crypto";

export function generateRandomString(lengthBytes = 32) {
  const randomBytes = crypto.randomBytes(lengthBytes);
  return randomBytes.toString("base64url");
}
