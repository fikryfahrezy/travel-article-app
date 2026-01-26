<script setup lang="ts">
import backgroundImage from "@/assets/kalen-emsley-Bkci_8qcdvQ-unsplash.jpg";
</script>
<template>
  <div class="flex flex-[1] flex-col gap-10 lg:flex-row">
    <img
      :src="backgroundImage"
      class="flex-1/2 w-full object-cover lg:flex-[1] lg:w-1/2"
    />
    <div class="flex flex-1/2 w-full flex-col justify-center lg:flex-[1] lg:w-1/2">
      <h1 class="text-primary mb-4 text-4xl">{{ $route.name }}</h1>
      <RouterView />
    </div>
  </div>
</template>
