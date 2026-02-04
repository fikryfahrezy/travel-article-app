<script setup lang="ts">
import { computed } from "vue";
import MyButton from "#layers/my-base/app/components/MyButton.vue";
import MyToaster from "#layers/my-base/app/components/MyToaster.vue";
import LoadingOverlay from "#layers/my-base/app/components/LoadingOverlay.vue";

const { loggedIn, clear: clearSession } = useUserSession();

async function logout() {
  await clearSession();
  await navigateTo("/");
}

const navItems = computed(() => {
  return [
    { name: "Home", path: "/", show: true },
    // { name: "Articles", path: "/articles", show: true },
    { name: "Register", path: "/register", show: !loggedIn.value },
    { name: "Login", path: "/login", show: !loggedIn.value },
  ];
});
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
          <template v-for="route in navItems" :key="route.path">
            <NuxtLink
              :to="route.path"
              v-if="route.show"
              class="hover:text-primary text-base hover:brightness-90 lg:text-xl"
              active-class="text-primary"
              exact-active-class="text-primary"
            >
              {{ route.name }}
            </NuxtLink>
          </template>
        </div>
        <MyButton
          v-if="loggedIn"
          variant="destructive"
          background="solid"
          @click="logout"
        >
          Logout
        </MyButton>
      </div>
    </nav>
    <main class="flex flex-[1] flex-col">
      <slot />
    </main>
  </div>
  <MyToaster />
  <LoadingOverlay />
</template>
