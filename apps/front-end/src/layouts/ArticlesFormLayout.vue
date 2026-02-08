<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
import Button from "@/components/Button.vue";
import NavBarItems from "./NavBarItems.vue";
import Main from "../components/Main.vue";
import { useArticleFormStore } from "@/stores/article-form";

const articleFormStore = useArticleFormStore();
</script>
<template>
  <NavBar>
    <NavBarItems />
    <div>
      <Button
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
      </Button>
    </div>
  </NavBar>
  <Main>
    <RouterView />
  </Main>
</template>
