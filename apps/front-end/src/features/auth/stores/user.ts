import { apiSdk } from "@/lib/api-sdk";
import type {
  LoginReqDto,
  ProfileResDto,
  RegisterReqDto,
} from "@/lib/api-sdk.types";
import { useLoadingStore } from "@/stores/loading";
import { acceptHMRUpdate, defineStore } from "pinia";

export type UseUserStoreState = {
  profile: ProfileResDto | null;
};

export const useUserStore = defineStore("user", {
  state: (): UseUserStoreState => {
    return {
      profile: null,
    };
  },
  actions: {
    async apiCall<
      TCallback extends () => Promise<unknown>,
      TReturn extends Awaited<ReturnType<TCallback>>,
    >(callback: TCallback) {
      const globalLoadingStore = useLoadingStore();
      const loadingId = globalLoadingStore.startLoading();

      const result = await callback();
      globalLoadingStore.stopLoading(loadingId);

      return result as TReturn;
    },
    async getProfile() {
      return await this.apiCall(async () => {
        const result = await apiSdk.profile();
        this.profile = result.success ? result.data : null;
        return result;
      });
    },
    async login(loginReqDto: LoginReqDto) {
      return await this.apiCall(async () => {
        const result = await apiSdk.login(loginReqDto);
        if (!result.success) {
          return result;
        }
        await this.getProfile();
        return result;
      });
    },
    async register(registerReqDto: RegisterReqDto) {
      return await this.apiCall(async () => {
        const result = await apiSdk.register(registerReqDto);
        if (!result.success) {
          return result;
        }
        await this.getProfile();
        return result;
      });
    },
    async logout() {
      return await this.apiCall(async () => {
        const result = await apiSdk.logout();
        if (!result.success) {
          return result;
        }
        this.profile = null;
        return result;
      });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
