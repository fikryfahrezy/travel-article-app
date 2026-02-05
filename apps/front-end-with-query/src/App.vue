<script setup lang="ts">
import Toaster from "./components/Toaster.vue";
import LoadingOverlay from "./components/LoadingOverlay.vue";
</script>

<template>
  <div
    id="page-layout"
    class="mx-auto flex min-h-dvh max-w-7xl flex-col px-4 lg:px-20"
  >
    <Suspense>
      <RouterView />
      <template #fallback> Loading ... </template>
    </Suspense>
  </div>
  <Toaster />
  <LoadingOverlay />
</template>
