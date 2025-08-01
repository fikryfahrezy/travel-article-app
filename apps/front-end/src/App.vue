<script setup lang="ts">
import { computed } from "vue";
import Button from "./components/Button.vue";
import LoadingOverlay from "./components/LoadingOverlay.vue";
import Toaster from "./components/Toaster.vue";

import { useUserStore } from "./features/auth/stores";
import { getNavItemRoutes } from "./pages/router";

const userStore = useUserStore();

const navRoutes = computed(() => {
  return getNavItemRoutes();
});

const publicRoutes = computed(() => {
  if (!userStore.profile) {
    return navRoutes.value;
  }

  return navRoutes.value.filter((route) => {
    return route.meta?.requiredAuth === undefined;
  });
});
</script>

<template>
  <div
    class="mx-auto flex h-dvh max-w-7xl flex-col px-4 py-4 lg:px-20 lg:py-10"
  >
    <nav class="flex flex-row items-center justify-between">
      <div class="flex flex-row gap-3 py-3 lg:py-10">
        <template v-for="route in publicRoutes" :key="route.path">
          <RouterLink
            :to="route.path"
            class="hover:text-primary text-base hover:brightness-90 lg:text-xl"
            >{{ route.name }}</RouterLink
          >
        </template>
      </div>
      <Button
        v-if="userStore.profile !== null"
        variant="destructive"
        background="solid"
        @click="userStore.logout"
      >
        Logout
      </Button>
    </nav>
    <main class="flex h-full flex-[1] flex-col">
      <RouterView />
    </main>
  </div>
  <Toaster />
  <LoadingOverlay />
</template>
