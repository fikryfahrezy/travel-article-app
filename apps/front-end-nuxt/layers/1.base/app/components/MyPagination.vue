<script setup lang="ts">
import { range } from "#layers/my-base/app/libs/array";
import { computed } from "vue";

const props = defineProps({
  currentPage: {
    type: Number,
    default: 0,
  },
  totalPages: {
    type: Number,
    default: 0,
  },
  items: {
    type: Number,
    default: 5,
  },
});

const pages = computed(() => {
  const lastPage = Math.min(
    Math.max(props.currentPage + 2, props.items),
    props.totalPages,
  );
  const firstPage = Math.max(1, lastPage - props.items - 1);
  const pages = range(firstPage, lastPage);
  if (pages.length === 0) {
    pages.push(1);
  }
  return pages;
});
</script>
<template>
  <div :class="['flex items-center', $attrs.class]">
    <slot name="prev-button"></slot>
    <template v-for="page in pages" :key="page">
      <slot name="page-item" :page="page"></slot>
    </template>
    <slot name="next-button"></slot>
  </div>
</template>
