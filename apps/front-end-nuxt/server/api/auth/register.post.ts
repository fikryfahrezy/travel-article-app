import { ApiSDK } from "#layers/my-base/app/libs/api-sdk";
import { registerFormSchema } from "#layers/my-auth/app/schemas/register.schema";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseUrl = config.apiBaseURL;
  const apiSdk = new ApiSDK(baseUrl + "/api");

  const registerReqDto = await readValidatedBody(event, registerFormSchema.safeParse)
  if (!registerReqDto.success) {
    throw createError({
      status: 422,
      message: "Invalid register data",
    })
  }

  const auth = await apiSdk.register(registerReqDto.data);
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
