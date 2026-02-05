<script setup lang="ts">
import MyButton from "#layers/my-base/app/components/MyButton.vue";
import MyInput from "#layers/my-base/app/components/MyInput.vue";
import {
  type LoginFormFieldErrors,
  loginFormSchema,
} from "#layers/my-auth/app/schemas/login.schema";
import { useLogin } from "#layers/my-auth/app/composables/auth";
import { useToastStore } from "#layers/my-base/app/composables/toast";
import z from "zod";

definePageMeta({
  layout: "auth",
  middleware: ["guest"],
});

const { mutateAsync: login } = useLogin();
const { fetch: refreshSession } = useUserSession();
const toastStore = useToastStore();
const formRef = useTemplateRef("form-ref");

const fieldErrors = ref<LoginFormFieldErrors>();

async function onSubmit() {
  const formElement = formRef.value;
  if (!formElement) {
    return;
  }

  const formData = new FormData(formElement);
  const formValue = Object.fromEntries(formData.entries());
  const loginForm = loginFormSchema.safeParse(formValue);

  if (!loginForm.success) {
    fieldErrors.value = z.flattenError(loginForm.error).fieldErrors;
    return;
  }

  try {
    await login(loginForm.data);
  } catch (error: any) {
    toastStore.showToast("error", error.message || "Login failed.");
    return;
  }

  toastStore.showToast("success", "Successfully login.");
  // Refresh the session on client-side and redirect to the home page
  await refreshSession();
  await navigateTo("/");
}
</script>
<template>
  <form
    ref="form-ref"
    class="flex w-full flex-col gap-4"
    @submit.prevent="onSubmit"
  >
    <label for="username">Username</label>
    <MyInput
      id="username"
      name="username"
      type="text"
      placeholder="Username"
      autocomplete="username"
      :aria-invalid="!!fieldErrors?.username"
    />
    <ul>
      <li
        v-for="error in fieldErrors?.username || []"
        :key="error"
        class="text-destructive"
      >
        {{ error }}
      </li>
    </ul>
    <label for="password">Password</label>
    <MyInput
      id="password"
      name="password"
      type="password"
      placeholder="Password"
      autocomplete="current-password"
      :aria-invalid="!!fieldErrors?.username"
    />
    <ul>
      <ul
        v-for="error in fieldErrors?.password || []"
        :key="error"
        class="text-destructive"
      >
        {{
          error
        }}
      </ul>
    </ul>
    <MyButton type="submit">Login</MyButton>
  </form>
</template>
