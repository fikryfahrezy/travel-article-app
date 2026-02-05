<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
import NavBarItems from "./NavBarItems.vue";
import Main from "./Main.vue";
import Button from "@/components/Button.vue";
import { useUserStore } from "@/features/auth/stores/user";

const userStore = useUserStore();
</script>
<template>
  <NavBar>
    <NavBarItems />
    <div v-if="userStore.isAuthenticated" class="flex justify-end py-3">
      <RouterLink v-slot="{ href, navigate }" custom to="/articles/form">
        <Button as="a" :href="href" class="w-full lg:w-fit" @click="navigate">
          Contribute Your Story
        </Button>
      </RouterLink>
    </div>
  </NavBar>
  <Main>
    <RouterView />
  </Main>
</template>
