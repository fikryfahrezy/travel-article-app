import { useLoadingStore } from "@/stores/loading";
import { acceptHMRUpdate, defineStore } from "pinia";
import { apiSdk } from "../../lib/api-sdk";
import type {
  LoginReqDto,
  ProfileResDto,
  RegisterReqDto,
} from "../../lib/api-sdk.types";

export type UseUserStoreState = {
  profile: ProfileResDto | null;
  loadingProfile: boolean;
};

export const useUserStore = defineStore("user", {
  state: (): UseUserStoreState => {
    return {
      profile: null,
      loadingProfile: false,
    };
  },
  actions: {
    async apiCall<
      TCallback extends () => Promise<unknown>,
      TReturn extends Awaited<ReturnType<TCallback>>,
    >(callback: TCallback) {
      const globalLoadingStore = useLoadingStore();
      globalLoadingStore.startLoading();
      this.loadingProfile = true;

      const result = await callback();

      this.loadingProfile = false;
      globalLoadingStore.stopLoading();

      return result as TReturn;
    },
    async getProfile() {
      return await this.apiCall(async () => {
        const profileResult = await apiSdk.profile();
        this.profile = profileResult.success ? profileResult.data : null;
        return profileResult;
      });
    },
    async login(loginReqDto: LoginReqDto) {
      return await this.apiCall(async () => {
        const loginResult = await apiSdk.login(loginReqDto);
        if (!loginResult.success) {
          return loginResult;
        }
        await this.getProfile();
      });
    },
    async register(registerReqDto: RegisterReqDto) {
      return await this.apiCall(async () => {
        const loginResult = await apiSdk.register(registerReqDto);
        if (!loginResult.success) {
          return loginResult;
        }
        await this.getProfile();
      });
    },
    async logout() {
      return await this.apiCall(async () => {
        const loginResult = await apiSdk.logout();
        if (!loginResult.success) {
          return loginResult;
        }
        this.profile = null;
      });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
