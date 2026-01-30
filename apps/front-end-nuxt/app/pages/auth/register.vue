<script setup lang="ts">
import MyButton from "@/components/MyButton.vue";
import MyInput from "@/components/MyInput.vue";
import {
  type RegisterFormFieldErrors,
  registerFormSchema,
} from "@/schemas/register.schema";
import { useRegister } from "@/composables/auth";
import { useToastStore } from "@/composables/toast";
import { ref, useTemplateRef } from "vue";
import z from "zod";
import { navigateTo } from "#app";
import { definePageMeta, useUserSession } from "#imports";

definePageMeta({
  layout: 'auth',
})

const { mutateAsync: register } = useRegister();
const { fetch: refreshSession } = useUserSession()
const toastStore = useToastStore();
const formRef = useTemplateRef("form-ref");

const fieldErrors = ref<RegisterFormFieldErrors>();

async function onSubmit() {
  const formElement = formRef.value;
  if (!formElement) {
    return;
  }

  const formData = new FormData(formElement);
  const formValue = Object.fromEntries(formData.entries());
  const registerForm = registerFormSchema.safeParse(formValue);

  if (!registerForm.success) {
    fieldErrors.value = z.flattenError(registerForm.error).fieldErrors;
    return;
  }

  try {
    await register(registerForm.data);
  } catch (error: any) {
    toastStore.showToast("error", error.message || "Register failed.");
    return;
  }

  toastStore.showToast("success", "Successfully register.");
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
    <label for="name">Name</label>
    <MyInput
      id="name"
      name="name"
      type="text"
      placeholder="Name"
      :aria-invalid="!!fieldErrors?.name"
    />
    <ul>
      <li
        v-for="error in fieldErrors?.name || []"
        :key="error"
        class="text-destructive"
      >
        {{ error }}
      </li>
    </ul>
    <label for="username">Username</label>
    <MyInput
      id="username"
      name="username"
      type="text"
      placeholder="Username"
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
      :aria-invalid="!!fieldErrors?.password"
    />
    <ul>
      <li
        v-for="error in fieldErrors?.password || []"
        :key="error"
        class="text-destructive"
      >
        {{ error }}
      </li>
    </ul>
    <MyButton type="submit">Register</MyButton>
  </form>
</template>
