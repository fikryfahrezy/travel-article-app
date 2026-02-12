<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
import Button from "@/components/Button.vue";
import NavBarItems from "./NavBarItems.vue";
import Main from "../components/Main.vue";
import { useArticleFormStore } from "@/stores/article-form";

const { tabs, activeTab, setActiveTab } = useArticleFormStore();
</script>
<template>
  <NavBar>
    <NavBarItems />
    <div>
      <Button
        v-for="tab in tabs"
        :key="tab"
        background="text"
        :variant="activeTab === tab ? 'primary' : 'neutral'"
        :class="[
          'w-1/2 border-b-2 capitalize',
          activeTab === tab ? 'border-b-primary' : 'border-b-neutral-400',
        ]"
        @click="setActiveTab(tab)"
      >
        {{ tab }}
      </Button>
    </div>
  </NavBar>
  <Main>
    <RouterView />
  </Main>
</template>
