<script setup lang="ts">
import backgroundImage from "@/assets/kalen-emsley-Bkci_8qcdvQ-unsplash.jpg";
</script>
<template>
  <div class="flex h-full flex-col gap-10 lg:flex-row">
    <img
      :src="backgroundImage"
      class="h-1/2 w-full object-cover lg:h-full lg:w-1/2"
    />
    <div class="flex h-1/2 w-full flex-col justify-center lg:h-full lg:w-1/2">
      <h1 class="text-primary mb-4 text-4xl">{{ $route.name }}</h1>
      <RouterView />
    </div>
  </div>
</template>
