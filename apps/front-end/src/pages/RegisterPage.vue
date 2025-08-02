<script setup lang="ts">
import Button from "@/components/Button.vue";
import Input from "@/components/Input.vue";
import {
  type RegisterFormFieldErrors,
  registerFormSchema,
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

  const registerResult = await userStore.register(registerForm.data);
  if (!registerResult.success) {
    toastStore.showToast("error", registerResult.error.message);
    return;
  }
  toastStore.showToast("success", "Successfully register.");
  router.push("/");
}
</script>
<template>
  <form
    ref="form-ref"
    class="flex w-full flex-col gap-4"
    @submit.prevent="onSubmit"
  >
    <label for="name">Name</label>
    <Input
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
    <Input
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
    <Input
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
    <Button type="submit">Register</Button>
  </form>
</template>
