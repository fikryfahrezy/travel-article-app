<script setup lang="ts">
import NavBar from "#layers/my-base/app/components/NavBar.vue";
import MyButton from "#layers/my-base/app/components/MyButton.vue";
import Main from "#layers/my-base/app/components/MainX.vue";
import NavBarItems from "#layers/my-auth/app/components/NavBarItems.vue";

const { loggedIn } = useUserSession();
</script>
<template>
  <NuxtLayout name="default">
    <NavBar>
      <NavBarItems />
      <div v-if="loggedIn" class="flex justify-end py-3">
        <RouterLink v-slot="{ href, navigate }" custom to="/articles/form">
          <MyButton as="a" :href="href" class="w-full lg:w-fit" @click="navigate">
            Contribute Your Story
          </MyButton>
        </RouterLink>
      </div>
    </NavBar>
    <Main>
      <slot />
    </Main>
  </NuxtLayout>
</template>
