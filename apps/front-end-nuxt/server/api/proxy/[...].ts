export default defineEventHandler(async (event) => {
  const { secure } = await requireUserSession(event);
  console.log('secure', secure);
  if (!secure) {
    throw createError({
      status: 401,
      message: 'Unauthorized',
    })
  }

  const config = useRuntimeConfig()
  const baseUrl = config.apiBaseURL;

  const path = event.path.replace(/^\/api\/proxy/, '/api') || '/';
  const target = baseUrl + path;

  return proxyRequest(event, target, {
    headers: {
      "Authorization": `Bearer ${secure.access_token}`,
    }
  });
});