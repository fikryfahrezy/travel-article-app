<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
import NavBarItems from "./NavBarItems.vue";
import Main from "../components/Main.vue";
import Button from "@/components/Button.vue";
import { useUserStore } from "@/features/auth/stores/user";

const { isAuthenticated } = useUserStore();
</script>
<template>
  <NavBar>
    <NavBarItems />
    <div v-if="isAuthenticated" class="flex justify-end py-3">
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
