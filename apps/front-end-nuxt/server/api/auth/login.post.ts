import { ApiSDK } from "~/libs/api-sdk";
import { loginFormSchema } from "~/schemas/login.schema"

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseUrl = config.apiBaseURL;
  const apiSdk = new ApiSDK(baseUrl + "/api");

  const loginReqDto = await readValidatedBody(event, loginFormSchema.parse)
  const auth = await apiSdk.login(loginReqDto);
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
