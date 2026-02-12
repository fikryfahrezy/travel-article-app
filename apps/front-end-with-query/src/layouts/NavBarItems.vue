<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import Button from "@/components/Button.vue";
import { useUserStore } from "@/features/auth/stores/user";
import { navItems } from "@/pages/router";

const router = useRouter();
const { profile, logout } = useUserStore();

const publicRoutes = computed(() => {
  if (!profile) {
    return navItems;
  }

  return navItems.filter((route) => {
    return route.meta?.requiredAuth === undefined;
  });
});

async function onLogout() {
  await logout();
  router.push("/");
}
</script>

<template>
  <div class="flex flex-row items-center justify-between gap-3 py-3 lg:py-7">
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
      v-if="profile !== null"
      variant="destructive"
      background="solid"
      @click="onLogout"
    >
      Logout
    </Button>
  </div>
</template>
