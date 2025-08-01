<script setup lang="ts">
type ButtonProps = {
  as?: string;
};

withDefaults(defineProps<ButtonProps>(), {
  as: "label",
});
</script>

<template>
  <component :is="as" :class="$attrs.class">
    <slot />
  </component>
</template>
