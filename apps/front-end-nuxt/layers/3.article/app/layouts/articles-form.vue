<script setup lang="ts">
import NavBar from "#layers/my-base/app/components/NavBar.vue";
import MyButton from "#layers/my-base/app/components/MyButton.vue";
import Main from "#layers/my-base/app/components/MainX.vue";
import NavBarItems from "#layers/my-auth/app/components/NavBarItems.vue";
import { useArticleFormStore } from "#layers/my-article/app/stores/article-form";

const articleFormStore = useArticleFormStore();
</script>
<template>
  <NuxtLayout name="default">
    <NavBar>
      <NavBarItems />
      <div>
        <MyButton
          v-for="tab in articleFormStore.tabs"
          :key="tab"
          background="text"
          :variant="articleFormStore.activeTab === tab ? 'primary' : 'neutral'"
          :class="[
            'w-1/2 border-b-2 capitalize',
            articleFormStore.activeTab === tab
              ? 'border-b-primary'
              : 'border-b-neutral-400',
          ]"
          @click="articleFormStore.setActiveTab(tab)"
        >
          {{ tab }}
        </MyButton>
      </div>
    </NavBar>
    <Main>
      <slot />
    </Main>
  </NuxtLayout>
</template>
