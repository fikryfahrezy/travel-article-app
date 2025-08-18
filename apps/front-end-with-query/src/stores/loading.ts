import { randomString } from "@/lib/string";
import { acceptHMRUpdate, defineStore } from "pinia";

export type UseLoadingStoreState = {
  callerIds: Record<string, boolean>;
};

export const useLoadingStore = defineStore("loading", {
  state: (): UseLoadingStoreState => {
    return {
      callerIds: {},
    };
  },
  actions: {
    startLoading() {
      const callerId = randomString();
      this.callerIds[callerId] = true;
      return callerId;
    },
    stopLoading(callerId: string) {
      delete this.callerIds[callerId];
    },
  },
  getters: {
    isLoading: (state) => Object.keys(state.callerIds).length !== 0,
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLoadingStore, import.meta.hot));
}
