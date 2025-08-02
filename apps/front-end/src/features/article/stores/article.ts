import { apiSdk } from "@/lib/api-sdk";
import type {
  CreateArticleReqDto,
  DeleteArticleReqDto,
  GetAllArticleResDto,
  GetArticleReqDto,
  LikeArticleReqDto,
  PaginationReqDto,
  UpdateArticleReqDto,
} from "@/lib/api-sdk.types";
import { useLoadingStore } from "@/stores/loading";
import { acceptHMRUpdate, defineStore } from "pinia";

export type UseArticleStoreState = GetAllArticleResDto & {
  latestPagination: PaginationReqDto;
};

export const useArticleStore = defineStore("article", {
  state: (): UseArticleStoreState => {
    return {
      total_data: 0,
      total_pages: 0,
      limit: 0,
      page: 1,
      data: [],
      latestPagination: {
        limit: 10,
        page: 1,
      },
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
    async getAllArticle(paginationReqDto: PaginationReqDto) {
      return await this.apiCall(async () => {
        const result = await apiSdk.getAllArticle(paginationReqDto);
        if (!result.success) {
          return result;
        }

        this.latestPagination = paginationReqDto;
        this.data = result.data.data;
        this.limit = result.data.limit;
        this.total_data = result.data.total_data;
        this.total_pages = result.data.total_pages;
        this.page = result.data.page;

        return result;
      });
    },
    async createArticle(createArticleReqDto: CreateArticleReqDto) {
      return await this.apiCall(async () => {
        const result = await apiSdk.createArticle(createArticleReqDto);
        await this.getAllArticle({ ...this.latestPagination, page: 1 });
        return result;
      });
    },
    async getArticle(getArticleReqDto: GetArticleReqDto) {
      return await this.apiCall(async () => {
        const result = await apiSdk.getArticle(getArticleReqDto);
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
        if (!result.success) {
          return result;
        }
        await this.getAllArticle(this.latestPagination);
        return result;
      });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useArticleStore, import.meta.hot));
}
