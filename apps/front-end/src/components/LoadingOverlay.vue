<script setup lang="ts">
import { useLoadingStore } from "@/stores/loading";

const globalLoadingStore = useLoadingStore();
</script>

<template>
  <div
    v-if="globalLoadingStore.isLoading"
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
  >
    <div class="flex flex-col items-center text-white">
      <div
        class="h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-white"
      ></div>
      <p class="mt-4 text-lg">Loading...</p>
    </div>
  </div>
</template>
