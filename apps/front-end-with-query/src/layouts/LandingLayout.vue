<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
import NavBarItems from "./NavBarItems.vue";
import Main from "./Main.vue";
</script>
<template>
  <NavBar>
    <NavBarItems />
  </NavBar>
  <Main>
    <RouterView />
  </Main>
</template>
