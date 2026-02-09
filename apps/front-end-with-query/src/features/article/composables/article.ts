import { apiSdk } from "@/lib/api-sdk";
import type {
  CreateArticleReqDto,
  DeleteArticleReqDto,
  LikeArticleReqDto,
  MutationResDto,
  UpdateArticleReqDto,
} from "@/lib/api-sdk.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { Ref } from "vue";

export const articleKeys = {
  all: ["article"] as const,
  list: () => {
    return [...articleKeys.all, "list"] as const;
  },
  listQuery: (paginationPage: Ref<number>, paginationLimit: number) => {
    return [...articleKeys.list(), paginationPage, paginationLimit] as const;
  },
  detail: () => {
    return [...articleKeys.all, "detail"] as const;
  },
  detailItem: (articleIdOrSlug: Ref<string>) => {
    return [...articleKeys.detail(), articleIdOrSlug] as const;
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
  delete: () => {
    return [...articleKeys.all, "delete"] as const;
  },
};

export function useArticles(paginationPage: Ref<number>, paginationLimit = 10) {
  return useQuery({
    queryKey: articleKeys.listQuery(paginationPage, paginationLimit),
    queryFn: async () => {
      const result = await apiSdk.getAllArticle({
        limit: paginationLimit,
        page: paginationPage.value,
      });
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    initialData: {
      data: [],
      page: 1,
      limit: paginationLimit,
      total_data: 0,
      total_pages: 0,
    },
  });
}

export function useArticleDetail(articleIdOrSlug: Ref<string>) {
  return useQuery({
    queryKey: articleKeys.detailItem(articleIdOrSlug),
    queryFn: async () => {
      const result = await apiSdk.getArticle({
        idOrSlug: articleIdOrSlug.value,
      });
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    enabled: () => {
      return !!articleIdOrSlug.value;
    },
  });
}

export function useLikeArticle() {
  const queryClient = useQueryClient();

  return useMutation<MutationResDto, Error, LikeArticleReqDto>({
    mutationKey: articleKeys.like(),
    mutationFn: async (likeArticleReqDto) => {
      const result = await apiSdk.likeArticle(likeArticleReqDto);
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

export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation<MutationResDto, Error, CreateArticleReqDto>({
    mutationKey: articleKeys.create(),
    mutationFn: async (createArticleReqDto) => {
      const result = await apiSdk.createArticle(createArticleReqDto);
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
      const result = await apiSdk.updateArticle(updateArticleReqDto);
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
    mutationKey: articleKeys.delete(),
    mutationFn: async (deleteArticleReqDto) => {
      const result = await apiSdk.deleteArticle(deleteArticleReqDto);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: articleKeys.list(),
      });
    },
  });
}
