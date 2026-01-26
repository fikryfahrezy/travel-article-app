<script setup lang="ts">
import backgroundImage from "@/assets/kalen-emsley-Bkci_8qcdvQ-unsplash.jpg";
</script>
<template>
  <div class="flex flex-[1] flex-col gap-10 lg:flex-row">
    <img
      :src="backgroundImage"
      class="w-full flex-1/2 object-cover lg:w-1/2 lg:flex-[1]"
    />
    <div
      class="flex w-full flex-1/2 flex-col justify-center lg:w-1/2 lg:flex-[1]"
    >
      <h1 class="text-primary mb-4 text-4xl">{{ $route.name }}</h1>
      <RouterView />
    </div>
  </div>
</template>
