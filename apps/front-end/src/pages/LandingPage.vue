<script setup lang="ts">
import backgroundImage from "@/assets/kalen-emsley-Bkci_8qcdvQ-unsplash.jpg";
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
      class="text-primary flex items-center space-x-4 text-2xl"
    >
      <span>Get inspired</span>
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
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </RouterLink>
  </div>
</template>
