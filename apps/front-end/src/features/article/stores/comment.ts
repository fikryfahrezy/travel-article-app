import { apiSdk } from "@/lib/api-sdk";
import type {
  CreateArticleCommentReqDto,
  DeleteArticleCommentReqDto,
  GetAllArticleCommentReqDto,
  GetAllArticleCommentResDto,
  GetArticleCommentReqDto,
  UpdateArticleCommentReqDto,
} from "@/lib/api-sdk.types";
import { useLoadingStore } from "@/stores/loading";
import { acceptHMRUpdate, defineStore } from "pinia";
import { useArticleStore } from "./article";

export type UseCommentStoreState = {
  allError: Error | null;
  all: GetAllArticleCommentResDto | null;
};

export const useCommentStore = defineStore("comment", {
  state: (): UseCommentStoreState => {
    return {
      allError: null,
      all: null,
    };
  },
  getters: {
    allArticleComment: (state) => {
      return (
        state.all || {
          total_data: 0,
          total_pages: 0,
          limit: 0,
          page: 1,
          data: [],
        }
      );
    },
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
    async getAllArticleComment(
      getAllArticleCommentReqDto: GetAllArticleCommentReqDto,
    ) {
      return await this.apiCall(async () => {
        const result = await apiSdk.getAllArticleComment(
          getAllArticleCommentReqDto,
        );
        if (!result.success) {
          return result;
        }

        this.all = {
          data: result.data.data,
          limit: result.data.limit,
          total_data: result.data.total_data,
          total_pages: result.data.total_pages,
          page: result.data.page,
        };

        return result;
      });
    },
    async createArticleComment(
      createArticleCommentReqDto: CreateArticleCommentReqDto,
    ) {
      return await this.apiCall(async () => {
        const createArticleCommentResult = await apiSdk.createArticleComment(
          createArticleCommentReqDto,
        );
        return createArticleCommentResult;
      });
    },
    async getArticleComment(getArticleCommentReqDto: GetArticleCommentReqDto) {
      return await this.apiCall(async () => {
        const result = await apiSdk.getArticleComment(getArticleCommentReqDto);
        return result;
      });
    },
    async updateArticleComment(
      updateArticleCommentReqDto: UpdateArticleCommentReqDto,
    ) {
      return await this.apiCall(async () => {
        const result = await apiSdk.updateArticleComment(
          updateArticleCommentReqDto,
        );
        if (!result.success) {
          return result;
        }

        return result;
      });
    },
    async deleteArticleComment(
      DeleteArticleCommentReqDto: DeleteArticleCommentReqDto,
    ) {
      return await this.apiCall(async () => {
        const result = await apiSdk.deleteArticleComment(
          DeleteArticleCommentReqDto,
        );
        if (!result.success) {
          return result;
        }

        return result;
      });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useArticleStore, import.meta.hot));
}
