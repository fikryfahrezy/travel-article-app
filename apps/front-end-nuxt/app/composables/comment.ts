import { apiSdk } from "@/libs/api-sdk";
import type {
  CreateArticleCommentReqDto,
  DeleteArticleCommentReqDto,
  MutationResDto,
  UpdateArticleCommentReqDto,
} from "@/libs/api-sdk.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { Ref } from "vue";

export const commentKeys = {
  all: ["comment"] as const,
  list: (
    articleId: Ref<string>,
    paginationCommentPage: Ref<number>,
    paginationCommentLimit: number,
  ) => {
    return [
      ...commentKeys.all,
      "article",
      articleId,
      paginationCommentPage,
      paginationCommentLimit,
    ] as const;
  },
  create: () => {
    return [...commentKeys.all, "create"] as const;
  },
  update: () => {
    return [...commentKeys.all, "update"] as const;
  },
  delete: () => {
    return [...commentKeys.all, "delete"] as const;
  },
};

export function useArticleComments(
  articleId: Ref<string>,
  paginationCommentPage: Ref<number>,
  paginationCommentLimit = 10,
) {
  return useQuery({
    queryKey: commentKeys.list(
      articleId,
      paginationCommentPage,
      paginationCommentLimit,
    ),
    queryFn: async () => {
      const result = await apiSdk.getAllArticleComment({
        article_id: articleId.value ?? "",
        pagination: {
          limit: paginationCommentLimit,
          page: paginationCommentPage.value,
        },
      });

      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    enabled: () => {
      return !!articleId.value;
    },
    initialData: {
      data: [],
      page: 1,
      total_pages: 1,
      total_data: 0,
      limit: paginationCommentLimit,
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation<MutationResDto, Error, DeleteArticleCommentReqDto>({
    mutationKey: commentKeys.delete(),
    mutationFn: async (deleteArticleCommentReqDto) => {
      const result = await apiSdk.deleteArticleComment(
        deleteArticleCommentReqDto,
      );
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: commentKeys.all,
      });
    },
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation<MutationResDto, Error, CreateArticleCommentReqDto>({
    mutationKey: commentKeys.create(),
    mutationFn: async (createArticleCommentReqDto) => {
      const result = await apiSdk.createArticleComment(
        createArticleCommentReqDto,
      );
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: commentKeys.all,
      });
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation<MutationResDto, Error, UpdateArticleCommentReqDto>({
    mutationKey: commentKeys.update(),
    mutationFn: async (updateArticleCommentReqDto) => {
      const result = await apiSdk.updateArticleComment(
        updateArticleCommentReqDto,
      );
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: commentKeys.all,
      });
    },
  });
}
