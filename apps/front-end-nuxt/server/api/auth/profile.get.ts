import { ApiSDK } from "#layers/my-base/app/libs/api-sdk";

export default defineEventHandler(async (event) => {
  const { secure } = await requireUserSession(event);
  if (!secure) {
    throw createError({
      status: 401,
      message: 'Bad credentials',
    })
  }

  const config = useRuntimeConfig()
  const baseUrl = config.apiBaseURL;
  const apiSdk = new ApiSDK(baseUrl + "/api");

  const profile = await apiSdk.profile({
    token: secure.access_token,
  });
  if (!profile.success) {
    return profile.error;
  }

  // set the user session in the cookie
  // this server util is auto-imported by the auth-utils module
  await setUserSession(event, {
    secure: secure,
    user: profile.data,
  });

  return profile.data;
})
