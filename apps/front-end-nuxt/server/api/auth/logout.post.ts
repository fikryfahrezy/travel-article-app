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

  const logout = await apiSdk.logout({
    token: secure.access_token,
  });
  if (!logout.success) {
    return logout.error;
  }

  return logout.data;
});
