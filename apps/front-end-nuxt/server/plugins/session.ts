import { ApiSDK } from "#layers/my-base/app/libs/api-sdk";

export default defineNitroPlugin(() => {
  sessionHooks.hook('clear', async (session, event) => {
    const { secure } = session;
    if (!secure) {
      throw createError({
        status: 401,
        message: 'Bad credentials',
      })
    }

    const config = useRuntimeConfig()
    const baseUrl = config.apiBaseURL;
    const apiSdk = new ApiSDK(baseUrl + "/api");

    let token = secure.access_token;
    let attempt = 0;
    let run = true;
    do {
      attempt++;
      if (attempt > 5) {
        throw createError({
          status: 500,
          message: 'Failed to logout after multiple attempts',
        })
      }

      const logout = await apiSdk.logout({
        token: token,
      });
      if (!logout.success && logout.error?.name === 'UnauthorizedException') {
        const refresh = await apiSdk.refresh({
          token: secure.refresh_token,
        });
        if (!refresh.success) {
          run = false;
        } else {
          token = refresh.data.access_token;
        }
      } else if (!logout.success && logout.error?.name !== 'UnauthorizedException') {
        throw createError({
          status: 500,
          message: 'Failed to logout',
        })
      } else {
        run = false;
      }
    } while (run);

  })
})

