type LoginPayload = {
  username: string;
  password: string;
};

export function useLogin() {
  const mutateAsync = async (payload: LoginPayload) => {
    await $fetch("/api/login", {
      method: "POST",
      body: payload,
    });

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
    await $fetch("/api/register", {
      method: "POST",
      body: payload,
    });
  }

  return { mutateAsync }
}