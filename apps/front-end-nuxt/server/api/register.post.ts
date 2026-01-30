import { defineEventHandler, readValidatedBody, setUserSession, createError } from "#imports"
import { apiSdk } from "~/libs/api-sdk"
import { registerFormSchema } from "~/schemas/register.schema"

export default defineEventHandler(async (event) => {
  const registerReqDto = await readValidatedBody(event, registerFormSchema.parse)

  const auth = await apiSdk.register(registerReqDto);
  if (!auth.success) {
    throw createError({
      status: 400,
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
