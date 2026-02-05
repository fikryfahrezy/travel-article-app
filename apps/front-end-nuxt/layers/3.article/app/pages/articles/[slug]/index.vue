<script setup lang="ts">
import MyButton from "#layers/my-base/app/components/MyButton.vue";
import ChevronLeftIcon from "#layers/my-base/app/components/ChevronLeftIcon.vue";
import ChevronRightIcon from "#layers/my-base/app/components/ChevronRightIcon.vue";
import MarkdownPreview from "#layers/my-base/app/components/MarkdownPreview.vue";
import MyModal from "#layers/my-base/app/components/MyModal.vue";
import MyPagination from "#layers/my-base/app/components/MyPagination.vue";
import ArticleLikeButton from "#layers/my-article/app/components/ArticleLikeButton.vue";
import Comment from "#layers/my-article/app/components/Comment.vue";
import CommentFormCreate from "#layers/my-article/app/components/CommentFormCreate.vue";
import {
  useArticleDetail,
  useDeleteArticle,
} from "#layers/my-article/app/composables/article";
import {
  commentKeys,
  useArticleComments,
} from "#layers/my-article/app/composables/comment";
import { useMutationState } from "@tanstack/vue-query";

const route = useRoute();
const { user, loggedIn } = useUserSession();

const articleSlug = computed(() => {
  return String(route.params.articleSlug || "");
});

const showDeleteConfirmation = ref(false);
const paginationCommentPage = ref(1);

const {
  data: articleDetail,
  status: articleDetailStatus,
  error: articleDetailError,
} = useArticleDetail(articleSlug);

const { mutateAsync: deleteArticle } = useDeleteArticle();
const { data: articleComments, status: articleCommentsStatus } =
  useArticleComments(
    computed(() => articleDetail.value?.id || ""),
    paginationCommentPage,
  );

const prevCommentPage = computed(() => {
  return paginationCommentPage.value <= 1 ? 1 : paginationCommentPage.value - 1;
});

const nextCommentPage = computed(() => {
  return paginationCommentPage.value >=
    (articleComments.value?.total_pages ?? 1)
    ? (articleComments.value?.total_pages ?? 1)
    : paginationCommentPage.value + 1;
});

const allowedToModifyArticle = computed(() => {
  return (
    !!user.value &&
    !!articleDetail.value &&
    user.value.user_id === articleDetail.value.author_id
  );
});

async function onDeleteArticle() {
  if (articleDetail.value) {
    await deleteArticle({ article_id: articleDetail.value.id });
    await navigateTo("/articles");
  }
}

function commentAdded() {
  paginationCommentPage.value = 1;
}

const commentCreateStatus = useMutationState({
  filters: { mutationKey: commentKeys.create() },
  select: (mutation) => {
    return mutation.state.status;
  },
});

const lastCommentCreateStatus = computed(() => {
  const status = commentCreateStatus.value;
  return status[status.length - 1];
});

watch(lastCommentCreateStatus, (lastStatus) => {
  if (lastStatus === "success") {
    commentAdded();
  }
});

function commentDeleted() {
  // When last comment on the page other than 1 deleted
  // we should go back to the previous page to avoid accessing empty page
  if (
    paginationCommentPage.value !== 1 &&
    (articleComments.value?.data.length ?? 0) === 0
  ) {
    paginationCommentPage.value--;
    return;
  }
}

const commentDeletionStatus = useMutationState({
  filters: { mutationKey: commentKeys.delete() },
  select: (mutation) => {
    return mutation.state.status;
  },
});

const lastCommentDeleteStatus = computed(() => {
  const status = commentDeletionStatus.value;
  return status[status.length - 1];
});

watch(lastCommentDeleteStatus, (lastStatus) => {
  if (lastStatus === "success") {
    commentDeleted();
  }
});
</script>
<template>
  <div
    v-if="articleDetailStatus === 'error'"
    class="flex w-full flex-[1] items-center justify-center"
  >
    <h2 class="text-destructive text-4xl font-bold italic">
      🚨 {{ articleDetailError?.message }} 🚨
    </h2>
  </div>
  <div v-else-if="articleDetail">
    <div class="flex items-start justify-between">
      <div class="flex gap-2">
        <p>
          {{ articleDetail.author_username }}
        </p>
        <p>
          {{
            new Intl.DateTimeFormat().format(new Date(articleDetail.created_at))
          }}
        </p>
      </div>
      <div class="flex gap-2">
        <ArticleLikeButton
          v-if="loggedIn"
          :article-id="articleDetail.id"
          :liked="articleDetail.liked"
        />
        <RouterLink
          v-if="allowedToModifyArticle"
          v-slot="{ href, navigate }"
          custom
          :to="'/articles/form/' + articleDetail.id"
        >
          <MyButton background="text" as="a" :href="href" @click="navigate">
            Edit
          </MyButton>
        </RouterLink>

        <MyButton
          v-if="allowedToModifyArticle"
          background="text"
          variant="destructive"
          @click="showDeleteConfirmation = true"
        >
          Delete
        </MyButton>
      </div>
    </div>
    <MarkdownPreview
      :markdown-title="articleDetail.title"
      :markdown-content="articleDetail.content"
    />

    <CommentFormCreate
      v-if="loggedIn"
      class="mb-4"
      :article-id="articleDetail.id"
    />
    <div class="p-2">
      <p v-if="articleCommentsStatus === 'pending'">Loading comments...</p>
      <p v-else-if="(articleComments?.data.length ?? 0) === 0">
        No comment yet, become the first one!
      </p>
      <template v-else>
        <Comment
          v-for="comment in articleComments?.data"
          :key="comment.id"
          :comment-id="comment.id"
          :author-name="comment.author_username"
          :content="comment.content"
          :created-at="comment.created_at"
          :show-action="!!user && comment.author_id === user.user_id"
        />

        <MyPagination
          v-if="articleDetail"
          :total-pages="articleComments?.total_pages"
          class="mx-auto w-fit"
        >
          <template #prev-button>
            <MyButton
              :disabled="paginationCommentPage <= prevCommentPage"
              @click="paginationCommentPage--"
            >
              <ChevronLeftIcon />
            </MyButton>
          </template>
          <template #page-item="{ page }">
            <MyButton
              :disabled="paginationCommentPage === page"
              @click="paginationCommentPage = page"
            >
              {{ page }}
            </MyButton>
          </template>
          <template #next-button>
            <MyButton
              :disabled="paginationCommentPage >= nextCommentPage"
              @click="paginationCommentPage++"
            >
              <ChevronRightIcon />
            </MyButton>
          </template>
        </MyPagination>
      </template>
    </div>
  </div>
  <MyModal
    v-if="showDeleteConfirmation"
    title="🚨 Alert"
    @close="showDeleteConfirmation = false"
  >
    <template #content>
      <p class="font-medium">Are you sure want to delete the article?</p>
    </template>
    <template #cancel-button>
      <MyButton
        class="w-full lg:w-fit"
        variant="neutral"
        @click="showDeleteConfirmation = false"
      >
        Cancel
      </MyButton>
    </template>
    <template #confirm-button>
      <MyButton
        class="w-full lg:w-fit"
        variant="destructive"
        @click="onDeleteArticle"
      >
        Confirm
      </MyButton>
    </template>
  </MyModal>
</template>
