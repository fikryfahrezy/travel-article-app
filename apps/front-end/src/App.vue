<script setup lang="ts">
import { computed } from "vue";
import Button from "./components/Button.vue";
import Toaster from "./components/Toaster.vue";

import { useRouter } from "vue-router";
import LoadingOverlay from "./components/LoadingOverlay.vue";
import { useUserStore } from "./features/auth/stores/user";
import { navItems } from "./pages/router";

const router = useRouter();
const userStore = useUserStore();

const publicRoutes = computed(() => {
  if (!userStore.profile) {
    return navItems;
  }

  return navItems.filter((route) => {
    return route.meta?.requiredAuth === undefined;
  });
});

function logout() {
  router.push("/");
  userStore.logout();
}
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
            active-class="text-primary"
            exact-active-class="text-primary"
          >
            {{ route.name }}
          </RouterLink>
        </template>
      </div>
      <Button
        v-if="userStore.profile !== null"
        variant="destructive"
        background="solid"
        @click="logout"
      >
        Logout
      </Button>
    </nav>
    <main class="flex h-full flex-[1] flex-col overflow-y-scroll">
      <Suspense>
        <RouterView />
        <template #fallback> Loading ... </template>
      </Suspense>
    </main>
  </div>
  <Toaster />
  <LoadingOverlay />
</template>
