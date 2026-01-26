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

async function logout() {
  await userStore.logout();
  router.push("/");
}
</script>

<template>
  <div
    id="page-layout"
    class="mx-auto flex min-h-dvh max-w-7xl flex-col px-4 lg:px-20"
  >
    <nav id="nav-bar" class="bg-background sticky top-0 z-20">
      <div
        class="flex flex-row items-center justify-between gap-3 py-3 lg:py-7"
      >
        <div class="flex flex-row gap-3">
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
      </div>
    </nav>
    <main class="flex flex-[1] flex-col">
      <Suspense>
        <RouterView />
        <template #fallback> Loading ... </template>
      </Suspense>
    </main>
  </div>
  <Toaster />
  <LoadingOverlay />
</template>
