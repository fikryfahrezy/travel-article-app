import { ApiSDK } from "#layers/my-base/app/libs/api-sdk";

type LoginPayload = {
  username: string;
  password: string;
};

export function useLogin() {
  const mutateAsync = async (payload: LoginPayload) => {
    const apiSdk = new ApiSDK("/api");
    const login = await apiSdk.login(payload);
    if (!login.success) {
      throw login.error;
    }

    const profile = await apiSdk.profile({});
    if (!profile.success) {
      throw profile.error;
    }

    return profile.data;
  }

  return { mutateAsync }
}

type RegisterPayload = {
  name: string;
  username: string;
  password: string;
};

export function useRegister() {
  const mutateAsync = async (payload: RegisterPayload) => {
    const apiSdk = new ApiSDK("/api");
    const register = await apiSdk.register(payload);
    if (!register.success) {
      throw register.error;
    }

    const profile = await apiSdk.profile({});
    if (!profile.success) {
      throw profile.error;
    }

    return profile.data;
  }

  return { mutateAsync }
}