<script setup lang="ts">
type ButtonProps = {
  as?: string;
};

withDefaults(defineProps<ButtonProps>(), {
  as: "button",
});
</script>

<template>
  <component :is="as" :class="$attrs.class">
    <slot />
  </component>
</template>
