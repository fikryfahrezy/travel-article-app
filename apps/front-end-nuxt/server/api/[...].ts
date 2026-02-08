export default defineEventHandler(async (event) => {
  const { secure } = await getUserSession(event)

  const config = useRuntimeConfig()
  const baseUrl = config.apiBaseURL;

  const path = event.path.replace(/^\/api\/proxy/, '/api') || '/';
  const target = baseUrl + path;

  return proxyRequest(event, target, {
    headers: {
      "Authorization": secure ? `Bearer ${secure.access_token}` : undefined,
    }
  });
});