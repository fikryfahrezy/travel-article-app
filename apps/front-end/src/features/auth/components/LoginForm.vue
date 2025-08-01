<script setup lang="ts">
import Button from "@/components/Button.vue";
import Input from "@/components/Input.vue";
import Label from "@/components/Label.vue";
import { useTemplateRef } from "vue";
import z from "zod";
import { useUserStore } from "../stores/user";

const userStore = useUserStore();
const formRef = useTemplateRef("form-ref");

const LoginFormSchema = z.object({
  username: z.string(),
  password: z.string(),
});

function onSubmit() {
  const formElement = formRef.value;
  if (!formElement) {
    return;
  }
  const formData = new FormData(formElement);
  const formValue = Object.fromEntries(formData.entries());
  const loginForm = LoginFormSchema.safeParse(formValue);
  if (!loginForm.success) {
    return;
  }

  userStore.login(loginForm.data);
  console.log(formValue);
}
</script>
<template>
  <form ref="form-ref" class="flex flex-col gap-4" @submit.prevent="onSubmit">
    <Label for="username">Username</Label>
    <Input id="username" name="username" type="text" placeholder="Username" />
    <Label for="">Password</Label>
    <Input
      id="password"
      name="password"
      type="password"
      placeholder="Password"
    />
    <Button type="submit">Submit</Button>
  </form>
</template>
