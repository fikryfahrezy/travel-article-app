import { acceptHMRUpdate, defineStore } from "pinia";

export const useLoadingStore = defineStore("loading", {
  state: () => {
    return {
      isLoading: false,
    };
  },
  actions: {
    startLoading() {
      this.isLoading = true;
    },
    stopLoading() {
      this.isLoading = false;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLoadingStore, import.meta.hot));
}
