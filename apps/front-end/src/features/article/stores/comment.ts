import { apiSdk } from "@/lib/api-sdk";
import type {
  CreateArticleCommentReqDto,
  DeleteArticleCommentReqDto,
  GetAllArticleCommentReqDto,
  GetAllArticleCommentResDto,
  GetArticleCommentReqDto,
  PaginationReqDto,
  UpdateArticleCommentReqDto,
} from "@/lib/api-sdk.types";
import { useLoadingStore } from "@/stores/loading";
import { acceptHMRUpdate, defineStore } from "pinia";
import { useArticleStore } from "./article";

export type UseCommentStoreState = GetAllArticleCommentResDto & {
  latestPagination: Required<PaginationReqDto>;
  latestArticleId: string;
};

export const useCommentStore = defineStore("comment", {
  state: (): UseCommentStoreState => {
    return {
      total_data: 0,
      total_pages: 0,
      limit: 0,
      page: 1,
      data: [],
      latestArticleId: "",
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

        this.latestPagination = {
          limit: result.data.limit,
          page: result.data.page,
        };
        this.data = result.data.data;
        this.limit = result.data.limit;
        this.total_data = result.data.total_data;
        this.total_pages = result.data.total_pages;
        this.page = result.data.page;
        this.latestArticleId = getAllArticleCommentReqDto.article_id;

        return result;
      });
    },
    async prevGetAllArticleComment() {
      if (this.latestArticleId && this.latestPagination.page > 1) {
        return await this.getAllArticleComment({
          article_id: this.latestArticleId,
          pagination: {
            ...this.latestPagination,
            page: this.latestPagination.page - 1,
          },
        });
      }
    },
    async pageGetAllArticleComment(page: number) {
      if (this.latestArticleId) {
        return await this.getAllArticleComment({
          article_id: this.latestArticleId,
          pagination: {
            ...this.latestPagination,
            page: page,
          },
        });
      }
    },
    async nextGetAllArticleComment() {
      if (
        this.latestArticleId &&
        this.latestPagination.page < this.total_pages
      ) {
        return await this.getAllArticleComment({
          article_id: this.latestArticleId,
          pagination: {
            ...this.latestPagination,
            page: this.latestPagination.page + 1,
          },
        });
      }
    },
    async createArticleComment(
      createArticleCommentReqDto: CreateArticleCommentReqDto,
    ) {
      return await this.apiCall(async () => {
        const createArticleCommentResult = await apiSdk.createArticleComment(
          createArticleCommentReqDto,
        );
        if (this.latestArticleId) {
          await this.getAllArticleComment({
            article_id: this.latestArticleId,
            pagination: { ...this.latestPagination, page: 1 },
          });
        }

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

        if (this.latestArticleId) {
          await this.getAllArticleComment({
            article_id: this.latestArticleId,
            pagination: this.latestPagination,
          });
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

        if (this.latestArticleId) {
          await this.getAllArticleComment({
            article_id: this.latestArticleId,
            pagination: this.latestPagination,
          });
        }

        return result;
      });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useArticleStore, import.meta.hot));
}
