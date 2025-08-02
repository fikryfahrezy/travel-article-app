import { randomString } from "@/lib/string";
import { acceptHMRUpdate, defineStore } from "pinia";

export type ToastItem = {
  id: string;
  type: "success" | "error" | "";
  message: string;
};

export type UseToastStoreState = {
  items: ToastItem[];
};

export const useToastStore = defineStore("toast", {
  state: (): UseToastStoreState => {
    return {
      items: [],
    };
  },
  actions: {
    closeToast(id: string) {
      this.items = this.items.filter((item) => {
        return item.id !== id;
      });
    },
    showToast(
      type: ToastItem["type"],
      message: string,
      duration: number = 5000,
    ) {
      const id = randomString();
      this.items.push({
        id,
        type: type,
        message: message,
      });

      setTimeout(() => {
        this.closeToast(id);
      }, duration);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useToastStore, import.meta.hot));
}
