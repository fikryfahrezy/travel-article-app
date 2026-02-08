import { acceptHMRUpdate, defineStore } from "pinia";

export type UseArticleFormStoreState = {
  activeTab: "editor" | "preview";
  tabs: ["editor", "preview"]
};

export const useArticleFormStore = defineStore("articleForm", {
  state: (): UseArticleFormStoreState => {
    return {
      activeTab: "editor",
      tabs: ["editor", "preview"],
    };
  },
  actions: {
    setActiveTab(activeTab: "editor" | "preview") {
      this.activeTab = activeTab;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useArticleFormStore, import.meta.hot));
}
