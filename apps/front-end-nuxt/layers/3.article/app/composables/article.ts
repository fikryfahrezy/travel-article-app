import { apiSdkProxy } from "#layers/my-base/app/libs/api-sdk";
import type {
  CreateArticleReqDto,
  DeleteArticleReqDto,
  GetAllArticleResDto,
  GetArticleResDto,
  LikeArticleReqDto,
  MutationResDto,
  UpdateArticleReqDto,
} from "#layers/my-base/app/libs/api-sdk.types";
import { useMutation, useQueryClient } from "@tanstack/vue-query";

export const articleKeys = {
  all: ["article"] as const,
  list: () => {
    return [...articleKeys.all, "list"] as const;
  },
  detail: () => {
    return [...articleKeys.all, "detail"] as const;
  },
  like: () => {
    return [...articleKeys.all, "like"] as const;
  },
  create: () => {
    return [...articleKeys.all, "create"] as const;
  },
  update: () => {
    return [...articleKeys.all, "update"] as const;
  },
};

export function useArticles(paginationPage: Ref<number>, paginationLimit = 10) {
  return useAsyncData<GetAllArticleResDto, Error>(
    articleKeys.list().join(''),
    async () => {
      const result = await apiSdkProxy.getAllArticle({
        limit: paginationLimit,
        page: paginationPage.value,
      });
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    }, {
    default: () => {
      return {
        data: [],
        page: 1,
        limit: paginationLimit,
        total_data: 0,
        total_pages: 0,
      }
    }
  });
}

export function useArticleDetail(articleIdOrSlug: Ref<string>) {
  return useAsyncData<GetArticleResDto, Error>(
    articleKeys.detail().join(''),
    async () => {
      const result = await apiSdkProxy.getArticle({
        idOrSlug: articleIdOrSlug.value,
      });
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    });
}

export function useLikeArticle() {
  const mutateAsync = async (likeArticleReqDto: LikeArticleReqDto) => {
    const result = await apiSdkProxy.likeArticle(likeArticleReqDto);
    if (!result.success) {
      throw result.error;
    }

    await refreshNuxtData([
      articleKeys.list().join(''),
      articleKeys.detail().join(''),
    ]);
    return result.data;
  }

  return { mutateAsync }
}

export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation<MutationResDto, Error, CreateArticleReqDto>({
    mutationKey: articleKeys.create(),
    mutationFn: async (createArticleReqDto) => {
      const result = await apiSdkProxy.createArticle(createArticleReqDto);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: articleKeys.all,
      });
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();

  return useMutation<MutationResDto, Error, UpdateArticleReqDto>({
    mutationKey: articleKeys.update(),
    mutationFn: async (updateArticleReqDto) => {
      const result = await apiSdkProxy.updateArticle(updateArticleReqDto);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: articleKeys.all,
      });
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation<MutationResDto, Error, DeleteArticleReqDto>({
    mutationKey: articleKeys.update(),
    mutationFn: async (deleteArticleReqDto) => {
      const result = await apiSdkProxy.deleteArticle(deleteArticleReqDto);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: articleKeys.all,
      });
    },
  });
}
