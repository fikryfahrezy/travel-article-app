<script setup lang="ts">
import NavBar from "#layers/my-base/app/components/NavBar.vue";
import Main from "#layers/my-base/app/components/MainX.vue";
import NavBarItems from "#layers/my-auth/app/components/NavBarItems.vue";
</script>
<template>
  <NuxtLayout name="default">
    <NavBar>
      <NavBarItems />
    </NavBar>
    <Main>
      <RouterView />
    </Main>
  </NuxtLayout>
</template>
