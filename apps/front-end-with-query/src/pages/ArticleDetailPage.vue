<script setup lang="ts">
import Button from "@/components/Button.vue";
import ChevronLeftIcon from "@/components/ChevronLeftIcon.vue";
import ChevronRightIcon from "@/components/ChevronRightIcon.vue";
import MarkdownPreview from "@/components/MarkdownPreview.vue";
import Modal from "@/components/Modal.vue";
import Pagination from "@/components/Pagination.vue";
import ArticleLikeButton from "@/features/article/components/ArticleLikeButton.vue";
import Comment from "@/features/article/components/Comment.vue";
import CommentFormCreate from "@/features/article/components/CommentFormCreate.vue";
import { apiSdk } from "@/lib/api-sdk";
import { useUserStore } from "@/features/auth/stores/user";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useArticleDetail } from "@/features/article/composables/article";
import {
  commentKeys,
  useArticleComments,
} from "@/features/article/composables/comment";
import { useMutationState } from "@tanstack/vue-query";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const articleSlug = computed(() => {
  return String(route.params.articleSlug || "");
});

const showDeleteConfirmation = ref(false);
const paginationCommentPage = ref(1);

const {
  data: articleDetail,
  isError: articleDetailIsError,
  error: articleDetailError,
} = useArticleDetail(articleSlug);

const { data: articleComments, isLoading: articleCommentsIsLoading } =
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
    !!userStore.profile &&
    !!articleDetail.value &&
    userStore.profile.user_id === articleDetail.value.author_id
  );
});

async function deleteArticle() {
  if (articleDetail.value) {
    await apiSdk.deleteArticle({ article_id: articleDetail.value.id });
    router.replace("/acticles");
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
    v-if="articleDetailIsError"
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
          v-if="userStore.isAuthenticated"
          :article-id="articleDetail.id"
          :liked="articleDetail.liked"
        />
        <RouterLink
          v-if="allowedToModifyArticle"
          v-slot="{ href, navigate }"
          custom
          :to="'/articles/form/' + articleDetail.id"
        >
          <Button background="text" as="a" :href="href" @click="navigate">
            Edit
          </Button>
        </RouterLink>

        <Button
          v-if="allowedToModifyArticle"
          background="text"
          variant="destructive"
          @click="showDeleteConfirmation = true"
        >
          Delete
        </Button>
      </div>
    </div>
    <MarkdownPreview
      :markdown-title="articleDetail.title"
      :markdown-content="articleDetail.content"
    />

    <CommentFormCreate
      v-if="userStore.isAuthenticated"
      class="mb-4"
      :article-id="articleDetail.id"
    />
    <div class="p-2">
      <p v-if="articleCommentsIsLoading">Loading comments...</p>
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
          :show-action="
            !!userStore.profile &&
            comment.author_id === userStore.profile.user_id
          "
        />

        <Pagination
          v-if="articleDetail"
          :total-pages="articleComments?.total_pages"
          class="mx-auto w-fit"
        >
          <template #prev-button>
            <Button
              :disabled="paginationCommentPage <= prevCommentPage"
              @click="paginationCommentPage--"
            >
              <ChevronLeftIcon />
            </Button>
          </template>
          <template #page-item="{ page }">
            <Button
              :disabled="paginationCommentPage === page"
              @click="paginationCommentPage = page"
            >
              {{ page }}
            </Button>
          </template>
          <template #next-button>
            <Button
              :disabled="paginationCommentPage >= nextCommentPage"
              @click="paginationCommentPage++"
            >
              <ChevronRightIcon />
            </Button>
          </template>
        </Pagination>
      </template>
    </div>
  </div>
  <Modal
    v-if="showDeleteConfirmation"
    title="🚨 Alert"
    @close="showDeleteConfirmation = false"
  >
    <template #content>
      <p class="font-medium">Are you sure want to delete the article?</p>
    </template>
    <template #cancel-button>
      <Button
        class="w-full lg:w-fit"
        variant="neutral"
        @click="showDeleteConfirmation = false"
      >
        Cancel
      </Button>
    </template>
    <template #confirm-button>
      <Button
        class="w-full lg:w-fit"
        variant="destructive"
        @click="deleteArticle"
      >
        Confirm
      </Button>
    </template>
  </Modal>
</template>
