<script setup lang="ts">
type ButtonProps = {
  as?: string;
};

defineProps<ButtonProps>();
</script>

<template>
  <input
    :class="[
      'border-2 border-neutral-300 p-1 outline-none',
      'focus-visible:border-primary focus-visible:ring-primary/50 focus-visible:ring-[3px]',
      'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
      $attrs.class,
    ]"
  />
</template>
