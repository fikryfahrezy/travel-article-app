import * as crypto from "node:crypto";

export function generateRandomString(lengthBytes = 32) {
  const randomBytes = crypto.randomBytes(lengthBytes);
  return randomBytes.toString("base64url");
}

export function isUUID(str: string) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}
