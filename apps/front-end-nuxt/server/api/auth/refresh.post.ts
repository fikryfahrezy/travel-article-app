import { ApiSDK } from "#layers/my-base/app/libs/api-sdk";

export default defineEventHandler(async (event) => {
  const { secure, user } = await requireUserSession(event);
  if (!secure) {
    throw createError({
      status: 401,
      message: 'Bad credentials',
    })
  }

  const config = useRuntimeConfig()
  const baseUrl = config.apiBaseURL;
  const apiSdk = new ApiSDK(baseUrl + "/api");

  const refresh = await apiSdk.refresh({
    token: secure.refresh_token,
  });
  if (!refresh.success) {
    return refresh.error;
  }

  // set the user session in the cookie
  // this server util is auto-imported by the auth-utils module
  await replaceUserSession(event, {
    secure: refresh.data,
    user: user,
  });

  return refresh.data;
});
