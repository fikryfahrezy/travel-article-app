// shared/types/auth.d.ts
declare module '#auth-utils' {
  interface User {
    user_id: string;
    username: string;
  }

  interface SecureSessionData {
    tokenType: "Bearer";
    expires_in: number;
    access_token: string;
    refresh_token: string;
  }
}

export { }