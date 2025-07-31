import * as argon2 from "@node-rs/argon2";

export async function passwordHash(str: string) {
  return await argon2.hash(str);
}

export async function passwordVerify(hashed: string, password: string) {
  return await argon2.verify(hashed, password);
}
