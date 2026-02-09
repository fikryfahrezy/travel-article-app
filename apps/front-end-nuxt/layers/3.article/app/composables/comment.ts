import { apiSdkProxy } from "#layers/my-base/app/libs/api-sdk";
import type {
  CreateArticleCommentReqDto,
  DeleteArticleCommentReqDto,
  GetAllArticleCommentResDto,
  UpdateArticleCommentReqDto,
} from "#layers/my-base/app/libs/api-sdk.types";
import { useMutationStateStore } from "#layers/my-base/app/composables/mutation-state";

export const commentKeys = {
  all: ["comment"] as const,
  list: () => {
    return [...commentKeys.all, "list",] as const;
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
  return useAsyncData<GetAllArticleCommentResDto, Error>(
    () => {
      return commentKeys.list().toString()
    },
    async () => {
      const result = await apiSdkProxy.getAllArticleComment({
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
    {
      watch: [articleId, paginationCommentPage],
      immediate: !!articleId.value,
      default: () => {
        return {
          data: [],
          page: 1,
          total_pages: 1,
          total_data: 0,
          limit: paginationCommentLimit,
        }
      }
    }
  );
}

export function useDeleteComment() {
  const { setState: setMutationState } = useMutationStateStore();

  const mutateAsync = async (deleteArticleCommentReqDto: DeleteArticleCommentReqDto) => {
    setMutationState(
      commentKeys.delete().toString(),
      "pending"
    );

    const result = await apiSdkProxy.deleteArticleComment(
      deleteArticleCommentReqDto,
    );
    if (!result.success) {
      setMutationState(
        commentKeys.delete().toString(),
        "error"
      );
      throw result.error;
    }

    await refreshNuxtData([
      commentKeys.list().toString(),
    ])

    setMutationState(
      commentKeys.delete().toString(),
      "success"
    );

    return result.data;
  }

  return { mutateAsync }
}

export function useCreateComment() {
  const { setState: setMutationState } = useMutationStateStore();

  const mutateAsync = async (createArticleCommentReqDto: CreateArticleCommentReqDto) => {
    setMutationState(
      commentKeys.create().toString(),
      "pending"
    );

    const result = await apiSdkProxy.createArticleComment(
      createArticleCommentReqDto,
    );
    if (!result.success) {
      setMutationState(
        commentKeys.create().toString(),
        "error"
      );
      throw result.error;
    }

    await refreshNuxtData([
      commentKeys.list().toString(),
    ])

    setMutationState(
      commentKeys.create().toString(),
      "success"
    );

    return result.data;
  }

  return { mutateAsync }
}

export function useUpdateComment() {
  const { setState: setMutationState } = useMutationStateStore();

  const mutateAsync = async (updateArticleCommentReqDto: UpdateArticleCommentReqDto) => {
    setMutationState(
      commentKeys.update().toString(),
      "pending"
    );

    const result = await apiSdkProxy.updateArticleComment(
      updateArticleCommentReqDto,
    );
    if (!result.success) {
      setMutationState(
        commentKeys.update().toString(),
        "error"
      );
      throw result.error;
    }

    await refreshNuxtData([
      commentKeys.list().toString(),
    ])

    setMutationState(
      commentKeys.update().toString(),
      "success"
    );

    return result.data;
  }

  return { mutateAsync }

}
