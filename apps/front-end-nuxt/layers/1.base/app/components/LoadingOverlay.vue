<script setup lang="ts">
import { useLoadingStore } from "#layers/my-base/app/composables/loading";
import { useMutationStateStore } from "#layers/my-base/app/composables/mutation-state";
import Overlay from "./MyOverlay.vue";

const { anyPending } = useMutationStateStore();
const { isLoading } = useLoadingStore();
</script>

<template>
  <Overlay v-if="isLoading || anyPending">
    <div class="flex flex-col items-center text-white">
      <div
        class="h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-white"
      ></div>
      <p class="mt-4 text-lg">Loading...</p>
    </div>
  </Overlay>
</template>
