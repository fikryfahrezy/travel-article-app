<script setup lang="ts">
import Button from "@/components/Button.vue";
import Input from "@/components/Input.vue";
import {
  type LoginFormFieldErrors,
  loginFormSchema,
} from "@/features/auth/schemas";
import { useUserStore } from "@/features/auth/stores/user";
import { useToastStore } from "@/stores/toast";
import { ref, useTemplateRef } from "vue";
import { useRouter } from "vue-router";
import z from "zod";

const userStore = useUserStore();
const toastStore = useToastStore();
const router = useRouter();
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

  const loginResult = await userStore.login(loginForm.data);
  if (!loginResult.success) {
    toastStore.showToast("error", loginResult.error.message);
    return;
  }
  toastStore.showToast("success", "Successfully login.");
  router.push("/");
}
</script>
<template>
  <form
    ref="form-ref"
    class="flex w-full flex-col gap-4"
    @submit.prevent="onSubmit"
  >
    <label for="username">Username</label>
    <Input
      id="username"
      name="username"
      type="text"
      placeholder="Username"
      :aria-invalid="!!fieldErrors?.username"
    />
    <ul>
      <ul
        v-for="error in fieldErrors?.username || []"
        :key="error"
        class="text-destructive"
      >
        {{
          error
        }}
      </ul>
    </ul>
    <label for="password">Password</label>
    <Input
      id="password"
      name="password"
      type="password"
      placeholder="Password"
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
    <Button type="submit">Login</Button>
  </form>
</template>
