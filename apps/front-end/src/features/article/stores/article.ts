import { apiSdk } from "@/lib/api-sdk";
import type {
  CreateArticleReqDto,
  DeleteArticleReqDto,
  GetAllArticleResDto,
  GetArticleReqDto,
  GetArticleResDto,
  LikeArticleReqDto,
  PaginationReqDto,
  UpdateArticleReqDto,
} from "@/lib/api-sdk.types";
import { useLoadingStore } from "@/stores/loading";
import { acceptHMRUpdate, defineStore } from "pinia";

export type UseArticleStoreState = {
  all: GetAllArticleResDto | null;
  allError: Error | null;
  detail: GetArticleResDto | null;
  detailError: Error | null;
};

export const useArticleStore = defineStore("article", {
  state: (): UseArticleStoreState => {
    return {
      allError: null,
      all: null,
      detailError: null,
      detail: null,
    };
  },
  getters: {
    allArticle: (state) => {
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
    async getAllArticle(paginationReqDto: PaginationReqDto) {
      return await this.apiCall(async () => {
        const result = await apiSdk.getAllArticle(paginationReqDto);
        if (!result.success) {
          this.allError = result.error;
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
    async createArticle(createArticleReqDto: CreateArticleReqDto) {
      return await this.apiCall(async () => {
        const result = await apiSdk.createArticle(createArticleReqDto);
        return result;
      });
    },
    async getArticle(getArticleReqDto: GetArticleReqDto) {
      return await this.apiCall(async () => {
        const result = await apiSdk.getArticle(getArticleReqDto);
        if (!result.success) {
          this.detailError = result.error;
          return result;
        }
        this.detail = result.data;
        return result;
      });
    },
    async updateArticle(updateArticleReqDto: UpdateArticleReqDto) {
      return await this.apiCall(async () => {
        const result = await apiSdk.updateArticle(updateArticleReqDto);

        return result;
      });
    },
    async deleteArticle(deleteArticleReqDto: DeleteArticleReqDto) {
      return await this.apiCall(async () => {
        const result = await apiSdk.deleteArticle(deleteArticleReqDto);
        return result;
      });
    },
    async likeArticle(likeArticleReqDto: LikeArticleReqDto) {
      return await this.apiCall(async () => {
        const result = await apiSdk.likeArticle(likeArticleReqDto);
        return result;
      });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useArticleStore, import.meta.hot));
}
