export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseUrl = config.apiBaseURL;

  const path = event.path.replace(/^\/api\/proxy/, '') || '/';
  const target = baseUrl + path;

  return proxyRequest(event, target);
});