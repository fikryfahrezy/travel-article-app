<script setup lang="ts">
import Button from "@/components/Button.vue";
import Input from "@/components/Input.vue";
import Label from "@/components/Label.vue";
import { useToastStore } from "@/stores/toast";
import { ref, useTemplateRef } from "vue";
import { useRouter } from "vue-router";
import z from "zod";
import { registerFormSchema, type RegisterFormFieldErrors } from "../schemas";
import { useUserStore } from "../stores";

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

  const error = await userStore.register(registerForm.data);
  if (error) {
    toastStore.showToast("success", error.error.message);
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
    <Label for="name">Name</Label>
    <Input
      id="name"
      name="name"
      type="text"
      placeholder="Name"
      :aria-invalid="!!fieldErrors?.name"
    />
    <ul>
      <ul
        v-for="error in fieldErrors?.name || []"
        :key="error"
        class="text-destructive"
      >
        {{
          error
        }}
      </ul>
    </ul>
    <Label for="username">Username</Label>
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
    <Label for="password">Password</Label>
    <Input
      id="password"
      name="password"
      type="password"
      placeholder="Password"
      :aria-invalid="!!fieldErrors?.password"
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
    <Button type="submit">Register</Button>
  </form>
</template>
