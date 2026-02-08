<script setup lang="ts">
import backgroundImage from "#layers/my-base/app/assets/images/kalen-emsley-Bkci_8qcdvQ-unsplash.jpg";
import ArrowRightIcon from "#layers/my-base/app/components/ArrowRightIcon.vue";
import NavBar from "#layers/my-base/app/components/NavBar.vue";
import Main from "#layers/my-base/app/components/MainX.vue";
import NavBarItems from "#layers/my-auth/app/components/NavBarItems.vue";
</script>
<template>
  <NavBar>
    <NavBarItems />
  </NavBar>
  <Main>
    <h1
      class="text-primary mt-20 mb-8 max-w-3xs text-4xl font-bold lg:mt-0 lg:max-w-2xl lg:text-9xl"
    >
      Wanderlust calling.
    </h1>
    <img :src="backgroundImage" class="h-64 w-full object-cover lg:h-96" />
    <div class="flex flex-[1] flex-col items-end justify-end">
      <RouterLink
        to="/articles"
        class="text-primary flex items-center gap-4 text-2xl"
      >
        <span>Get inspired</span>
        <ArrowRightIcon />
      </RouterLink>
    </div>
  </Main>
</template>
