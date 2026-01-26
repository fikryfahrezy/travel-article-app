<script setup lang="ts">
import { useLoadingStore } from "@/stores/loading";
import { useIsFetching, useIsMutating } from "@tanstack/vue-query";
import Overlay from "./Overlay.vue";

const isFetching = useIsFetching();
const isMutating = useIsMutating();
const globalLoadingStore = useLoadingStore();
</script>

<template>
  <Overlay
    v-if="globalLoadingStore.isLoading || isFetching > 0 || isMutating > 0"
  >
    <div class="flex flex-col items-center text-white">
      <div
        class="h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-white"
      ></div>
      <p class="mt-4 text-lg">Loading...</p>
    </div>
  </Overlay>
</template>
