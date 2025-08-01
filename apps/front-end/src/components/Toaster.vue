<script setup lang="ts">
import { useToastStore, type UseToastStoreState } from "@/stores/toast";
import Button, { type ButtonProps } from "./Button.vue";

const globalToastStore = useToastStore();

const variantToken: Record<UseToastStoreState["type"], string> = {
  error: "[--bg:var(--destructive)] [--text:var(--color-white)]",
  success: "[--bg:var(--primary)] [--text:var(--color-white)]",
  [""]: "[--bg:var(--color-black)] [--text:var(--color-black)]",
};

const buttonVariantToken: Record<
  UseToastStoreState["type"],
  NonNullable<ButtonProps["variant"]>
> = {
  success: "primary",
  error: "destructive",
  [""]: "primary",
};
</script>

<template>
  <div
    :class="[
      'fixed right-10 bottom-0 left-10 z-[9999] flex items-center justify-between space-x-4 bg-(--bg) px-4 py-2 text-(--text) shadow-[5px_5px_black] transition-transform ease-linear lg:left-auto lg:w-fit lg:max-w-xs',
      variantToken[globalToastStore.type],
      globalToastStore.isShowing ? '-translate-y-full' : 'translate-y-full',
    ]"
  >
    <span>{{ globalToastStore.message }}</span>
    <Button
      v-if="globalToastStore.isShowing"
      :variant="buttonVariantToken[globalToastStore.type]"
      @click="globalToastStore.resetToast"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </Button>
  </div>
</template>
