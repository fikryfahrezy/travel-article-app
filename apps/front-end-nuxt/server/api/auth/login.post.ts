import { ApiSDK } from "#layers/my-base/app/libs/api-sdk";
import { loginFormSchema } from "#layers/my-auth/app/schemas/login.schema";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseUrl = config.apiBaseURL;
  const apiSdk = new ApiSDK(baseUrl + "/api");

  const loginReqDto = await readValidatedBody(event, loginFormSchema.safeParse)
  if (!loginReqDto.success) {
    throw createError({
      status: 422,
      message: "Invalid login data",
    })
  }

  const auth = await apiSdk.login(loginReqDto.data);
  if (!auth.success) {
    return auth.error;
  }

  // set the user session in the cookie
  // this server util is auto-imported by the auth-utils module
  await setUserSession(event, {
    secure: auth.data,
    user: {
      user_id: "",
      username: "",
    },
  })

  return auth.data;
})
