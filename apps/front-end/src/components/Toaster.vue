<script setup lang="ts">
import { useToastStore, type ToastItem } from "@/stores/toast";
import Button, { type ButtonProps } from "./Button.vue";
import XIcon from "./XIcon.vue";

const globalToastStore = useToastStore();

const variantToken: Record<ToastItem["type"], string> = {
  error: "[--bg:var(--destructive)] [--text:var(--color-white)]",
  success: "[--bg:var(--primary)] [--text:var(--color-white)]",
  [""]: "[--bg:var(--color-black)] [--text:var(--color-black)]",
};

const buttonVariantToken: Record<
  ToastItem["type"],
  NonNullable<ButtonProps["variant"]>
> = {
  success: "primary",
  error: "destructive",
  [""]: "primary",
};
</script>

<template>
  <div
    class="fixed right-10 bottom-10 left-10 z-[9999] space-y-4 lg:left-auto lg:w-fit lg:max-w-xs"
  >
    <div
      v-for="errorItem in globalToastStore.items"
      :key="errorItem.id"
      :class="[
        'flex items-center justify-between space-x-4 bg-(--bg) px-4 py-2 text-(--text) shadow-[5px_5px_black]',
        variantToken[errorItem.type],
      ]"
    >
      <span class="font-bold">{{ errorItem.message }}</span>
      <Button
        :variant="buttonVariantToken[errorItem.type]"
        @click="globalToastStore.closeToast(errorItem.id)"
      >
        <XIcon />
      </Button>
    </div>
  </div>
</template>
