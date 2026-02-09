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
import { useMutationStateStore } from "#layers/my-base/app/composables/mutation-state";

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
  delete: () => {
    return [...articleKeys.all, "delete"] as const;
  },
};

export function useArticles(paginationPage: Ref<number>, paginationLimit = 10) {
  return useAsyncData<GetAllArticleResDto, Error>(
    () => {
      return articleKeys.list().toString()
    },
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
    watch: [paginationPage],
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
    () => {
      return articleKeys.detail().toString()
    },
    async () => {
      const result = await apiSdkProxy.getArticle({
        idOrSlug: articleIdOrSlug.value,
      });
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    {
      watch: [articleIdOrSlug],
      immediate: !!articleIdOrSlug.value,
    }
  );
}

export function useLikeArticle() {
  const { setState: setMutationState } = useMutationStateStore();

  const mutateAsync = async (likeArticleReqDto: LikeArticleReqDto) => {
    setMutationState(
      articleKeys.like().toString(),
      "pending"
    );

    const result = await apiSdkProxy.likeArticle(likeArticleReqDto);
    if (!result.success) {
      setMutationState(
        articleKeys.like().toString(),
        "error"
      );

      throw result.error;
    }

    await refreshNuxtData([
      articleKeys.list().toString(),
      articleKeys.detail().toString(),
    ]);


    setMutationState(
      articleKeys.like().toString(),
      "success"
    );

    return result.data;
  }

  return { mutateAsync }
}

export function useCreateArticle() {
  const { setState: setMutationState } = useMutationStateStore();

  const mutateAsync = async (createArticleReqDto: CreateArticleReqDto) => {
    setMutationState(
      articleKeys.create().toString(),
      "pending"
    );

    const result = await apiSdkProxy.createArticle(createArticleReqDto);
    if (!result.success) {
      setMutationState(
        articleKeys.create().toString(),
        "error"
      );

      throw result.error;
    }

    await refreshNuxtData([
      articleKeys.list().toString(),
      articleKeys.detail().toString(),
    ]);


    setMutationState(
      articleKeys.create().toString(),
      "success"
    );

    return result.data;
  }

  return { mutateAsync }
}

export function useUpdateArticle() {
  const { setState: setMutationState } = useMutationStateStore();

  const mutateAsync = async (updateArticleReqDto: UpdateArticleReqDto) => {
    setMutationState(
      articleKeys.update().toString(),
      "pending"
    );

    const result = await apiSdkProxy.updateArticle(updateArticleReqDto);
    if (!result.success) {
      setMutationState(
        articleKeys.update().toString(),
        "error"
      );

      throw result.error;
    }

    await refreshNuxtData([
      articleKeys.all.toString(),
      articleKeys.detail().toString(),
    ]);


    setMutationState(
      articleKeys.update().toString(),
      "success"
    );

    return result.data;
  }

  return { mutateAsync }
}

export function useDeleteArticle() {
  const { setState: setMutationState } = useMutationStateStore();

  const mutateAsync = async (deleteArticleReqDto: DeleteArticleReqDto) => {
    setMutationState(
      articleKeys.delete().toString(),
      "pending"
    );

    const result = await apiSdkProxy.deleteArticle(deleteArticleReqDto);
    if (!result.success) {
      setMutationState(
        articleKeys.delete().toString(),
        "error"
      );

      throw result.error;
    }

    await refreshNuxtData([
      articleKeys.all.toString(),
    ]);

    setMutationState(
      articleKeys.delete().toString(),
      "success"
    );

    return result.data;
  }

  return { mutateAsync }
}
