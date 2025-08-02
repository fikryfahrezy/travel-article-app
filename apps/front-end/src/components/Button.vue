<script setup lang="ts">
const backgroundToken = {
  solid: "bg-(--bg) text-(--text) hover:bg-(--bg)/90",
  link: "text-(--bg) underline-offset-4 hover:underline",
  text: "text-(--bg)",
};

const variantToken = {
  primary: "[--bg:var(--primary)] [--text:var(--color-white)]",
  destructive: "[--bg:var(--destructive)] [--text:var(--color-white)]",
  neutral: "[--bg:var(--neutral)] [--text:var(--color-white)]",
};

const sizeToken = {
  default: "py-1 px-3",
  md: "py-1 text-xl px-3",
};

export type ButtonProps = {
  background?: keyof typeof backgroundToken;
  variant?: keyof typeof variantToken;
  size?: keyof typeof sizeToken;
  as?: string;
};

withDefaults(defineProps<ButtonProps>(), {
  as: "button",
  size: "default",
  background: "solid",
  variant: "primary",
});
</script>

<template>
  <component
    :is="as"
    :data-disabled="$attrs.disabled"
    :class="[
      'text-md inline-flex cursor-pointer items-center justify-center transition-colors',
      'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
      'data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50',
      sizeToken[size],
      variantToken[variant],
      backgroundToken[background],
      $attrs.class,
    ]"
  >
    <slot />
  </component>
</template>
