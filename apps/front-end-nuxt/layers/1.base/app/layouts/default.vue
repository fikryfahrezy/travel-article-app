<script setup lang="ts">
import MyToaster from "#layers/my-base/app/components/MyToaster.vue";
import LoadingOverlay from "#layers/my-base/app/components/LoadingOverlay.vue";
</script>

<template>
  <div
    id="page-layout"
    class="mx-auto flex min-h-dvh max-w-7xl flex-col px-4 lg:px-20"
  >
    <slot />
  </div>
  <MyToaster />
  <LoadingOverlay />
</template>
