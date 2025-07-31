import * as crypto from "node:crypto";

export function generateOpaqueToken(lengthBytes = 32) {
  const randomBytes = crypto.randomBytes(lengthBytes);
  return randomBytes.toString("base64url");
}
