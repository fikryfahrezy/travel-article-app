<script setup lang="ts">
import { computed } from "vue";
import MyButton from "#layers/my-base/app/components/MyButton.vue";

const { loggedIn, clear: clearSession } = useUserSession();
const { mutateAsync: logout } = useLogout();

async function onLogout() {
  await logout();
  await clearSession();
  await navigateTo("/");
}

const navItems = computed(() => {
  return [
    { name: "Home", path: "/", show: true },
    { name: "Articles", path: "/articles", show: true },
    { name: "Register", path: "/register", show: !loggedIn.value },
    { name: "Login", path: "/login", show: !loggedIn.value },
  ];
});
</script>

<template>
  <div class="flex flex-row items-center justify-between gap-3 py-3 lg:py-7">
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
      @click="onLogout"
    >
      Logout
    </MyButton>
  </div>
</template>
