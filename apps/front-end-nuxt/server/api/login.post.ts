import { defineEventHandler, readValidatedBody, setUserSession, createError } from "#imports"
import { apiSdk } from "~/libs/api-sdk"
import { loginFormSchema } from "~/schemas/login.schema"

export default defineEventHandler(async (event) => {
  const loginReqDto = await readValidatedBody(event, loginFormSchema.parse)

  const auth = await apiSdk.login(loginReqDto);
  if (!auth.success) {
    throw createError({
      status: 401,
      message: auth.error?.message || 'Bad credentials',
    })
  }

  const profile = await apiSdk.profile();
  if (!profile.success) {
    throw createError({
      status: 500,
      message: 'Failed to fetch user profile after login',
    })
  }

  // set the user session in the cookie
  // this server util is auto-imported by the auth-utils module
  await setUserSession(event, {
    user: profile.data,
    secure: auth.data,
  })

  return profile.data;
})
