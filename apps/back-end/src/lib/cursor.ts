import { Buffer } from "node:buffer";

export function decodeCursor(cursor: string) {
  const decoded = Buffer.from(cursor, "base64").toString("utf-8");
  const [id, date] = decoded.split("_");
  return [id, date] as const;
}

export function encodeCursor(identifer: string, date: Date) {
  return Buffer.from(`${identifer}_${date.toISOString()}`).toString("base64");
}
