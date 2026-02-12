import { acceptHMRUpdate, defineStore } from "pinia";

type MutationState = "idle" | "pending" | "success" | "error";

export type UseMutationStateStoreState = {
  keys: Record<string, MutationState>;
};

export const useMutationStateStore = defineStore("mutation-state", {
  state: (): UseMutationStateStoreState => {
    return {
      keys: {},
    };
  },
  actions: {
    setState(key: string, value: MutationState) {
      this.keys[key] = value;
    },
  },
  getters: {
    getState: (state) => {
      return (key: string) => {
        return computed(() => {
          return state.keys[key]
        });
      }
    },
    anyPending: (state) => {
      return computed(() => {
        const keyLoadingValues = Object.values(state.keys);
        if (keyLoadingValues.length === 0) {
        }

        return keyLoadingValues.some((value) => {
          return value === "pending"
        });
      });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMutationStateStore, import.meta.hot));
}