export default defineNuxtRouteMiddleware(() => {
  const { loggedIn } = useUserSession()

  // redirect the user to the page if they're authenticated
  if (loggedIn.value) {
    return navigateTo('/')
  }
})
