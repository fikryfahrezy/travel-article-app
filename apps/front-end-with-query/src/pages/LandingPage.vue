<script setup lang="ts">
import backgroundImage from "@/assets/kalen-emsley-Bkci_8qcdvQ-unsplash.jpg";
import ArrowRightIcon from "@/components/ArrowRightIcon.vue";
</script>
<template>
  <h1
    class="text-primary mt-20 mb-8 max-w-3xs text-4xl font-bold lg:mt-0 lg:max-w-2xl lg:text-9xl"
  >
    Wanderlust calling.
  </h1>
  <img :src="backgroundImage" class="h-64 w-full object-cover lg:h-96" />
  <div class="flex h-full flex-col items-end justify-end">
    <RouterLink
      to="/articles"
      class="text-primary flex items-center gap-4 text-2xl"
    >
      <span>Get inspired</span>
      <ArrowRightIcon />
    </RouterLink>
  </div>
</template>
