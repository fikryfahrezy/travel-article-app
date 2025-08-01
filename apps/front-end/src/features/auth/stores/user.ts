import { defineStore } from "pinia";
import { apiSdk } from "../../../lib/api-sdk";
import type {
  LoginReqDto,
  ProfileResDto,
  RegisterReqDto,
} from "../../../lib/api-sdk.types";

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
    async getProfile() {
      this.loadingProfile = true;
      const profileResult = await apiSdk.profile();
      if (!profileResult.success) {
        return;
      }
      this.profile = profileResult.data;
      this.loadingProfile = false;
    },
    async login(loginReqDto: LoginReqDto) {
      this.loadingProfile = true;
      const loginResult = await apiSdk.login(loginReqDto);
      if (!loginResult.success) {
        return;
      }
      await this.getProfile();
      this.loadingProfile = false;
    },
    async register(registerReqDto: RegisterReqDto) {
      this.loadingProfile = true;
      const loginResult = await apiSdk.register(registerReqDto);
      if (!loginResult.success) {
        return;
      }
      await this.getProfile();
      this.loadingProfile = false;
    },
    async logout() {
      this.loadingProfile = true;
      const loginResult = await apiSdk.logout();
      if (!loginResult.success) {
        return;
      }
      this.profile = null;
      this.loadingProfile = false;
    },
  },
});
