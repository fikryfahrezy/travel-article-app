<script setup lang="ts">
defineProps({
  content: {
    type: String,
    default: "",
  },
  authorName: {
    type: String,
    default: "",
  },
  createdAt: {
    type: String,
    default: "",
  },
});
</script>
<template>
  <div :class="['flex flex-col', $attrs.class]">
    <p class="font-medium">{{ authorName }}</p>
    <p class="text-xs">
      {{ new Intl.DateTimeFormat().format(new Date(createdAt)) }}
    </p>
    <p class="line-clamp-2 h-full">
      {{ content }}
    </p>
  </div>
</template>
