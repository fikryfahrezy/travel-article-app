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
  profileError: Error | null;
};

export const useUserStore = defineStore("user", {
  state: (): UseUserStoreState => {
    return {
      profileError: null,
      profile: null,
    };
  },
  getters: {
    isAuthenticated: (state) => {
      return !!state.profile;
    },
  },
  actions: {
    async getProfile() {
      const { startLoading, stopLoading } = useLoadingStore();
      const loadingId = startLoading();
      const result = await apiSdk.profile();
      stopLoading(loadingId);

      this.profile = result.success ? result.data : null;
      this.profileError = result.success ? null : result.error;

      return result;
    },
    async login(loginReqDto: LoginReqDto) {
      const { startLoading, stopLoading } = useLoadingStore();
      const loadingId = startLoading();
      const result = await apiSdk.login(loginReqDto);
      stopLoading(loadingId);

      if (!result.success) {
        return result;
      }

      await this.getProfile();
      return result;
    },
    async register(registerReqDto: RegisterReqDto) {
      const { startLoading, stopLoading } = useLoadingStore();
      const loadingId = startLoading();
      const result = await apiSdk.register(registerReqDto);
      stopLoading(loadingId);

      if (!result.success) {
        return result;
      }
      await this.getProfile();
      return result;
    },
    async logout() {
      const { startLoading, stopLoading } = useLoadingStore();
      const loadingId = startLoading();
      const result = await apiSdk.logout();
      stopLoading(loadingId);

      if (!result.success) {
        return result;
      }
      this.profile = null;
      return result;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
