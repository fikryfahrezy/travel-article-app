import { acceptHMRUpdate, defineStore } from "pinia";

export type UseToastStoreState = {
  type: "success" | "error" | "";
  message: string;
  isShowing: boolean;
};

export const useToastStore = defineStore("toast", {
  state: (): UseToastStoreState => {
    return {
      message: "",
      type: "",
      isShowing: false,
    };
  },
  actions: {
    showToast(type: UseToastStoreState["type"], message: string) {
      this.type = type;
      this.message = message;
      this.isShowing = true;
    },
    resetToast() {
      this.type = "";
      this.message = "";
      this.isShowing = false;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useToastStore, import.meta.hot));
}
