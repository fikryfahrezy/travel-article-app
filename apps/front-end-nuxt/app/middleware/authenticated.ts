import { defineNuxtRouteMiddleware, navigateTo } from "#app"
import { useUserSession } from "#imports"

export default defineNuxtRouteMiddleware(() => {
  const { loggedIn } = useUserSession()

  // redirect the user to the login screen if they're not authenticated
  if (!loggedIn.value) {
    return navigateTo('/login')
  }
})
