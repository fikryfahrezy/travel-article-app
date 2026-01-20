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
import { useQuery } from "@tanstack/vue-query";
import { apiSdk } from "@/lib/api-sdk";
import { useUserStore } from "@/features/auth/stores/user";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const showDeleteConfirmation = ref(false);

const articleSlug = computed(() => {
  return String(route.params.articleSlug);
});

const articleDetailQuery = useQuery({
  queryKey: computed(() => {
    return ["article-detail", articleSlug];
  }),
  queryFn: async () => {
    const result = await apiSdk.getArticle({ idOrSlug: articleSlug.value });
    if (!result.success)
      throw result.error ?? new Error("Failed to fetch article");
    return result.data;
  },
  enabled: !!articleSlug.value,
});

const articleDetail = computed(() => articleDetailQuery.data.value);

const paginationCommentLimit = 10;
const paginationCommentPage = ref(1);

const articleCommentsQuery = useQuery({
  queryKey: computed(() => {
    return [
      "article-comments",
      articleDetail.value?.id,
      paginationCommentPage.value,
      paginationCommentLimit,
    ];
  }),
  queryFn: async () => {
    if (!articleDetail.value?.id) {
      return {
        data: [],
        page: 1,
        total_pages: 1,
        total_data: 0,
        limit: paginationCommentLimit,
      };
    }

    const result = await apiSdk.getAllArticleComment({
      article_id: articleDetail.value.id,
      pagination: {
        limit: paginationCommentLimit,
        page: paginationCommentPage.value,
      },
    });

    if (!result.success) {
      throw result.error ?? new Error("Failed to fetch comments");
    }
    return result.data;
  },
  enabled: computed(() => !!articleDetail.value?.id),
});

// No need to watch articleSlug for fetching, handled by vue-query

// No need to watch articleDetail or paginationCommentPage.value for fetching, handled by vue-query

const prevCommentPage = computed(() => {
  return paginationCommentPage.value <= 1 ? 1 : paginationCommentPage.value - 1;
});

const nextCommentPage = computed(() => {
  return paginationCommentPage.value >=
    (articleCommentsQuery.data.value?.total_pages ?? 1)
    ? (articleCommentsQuery.data.value?.total_pages ?? 1)
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
    router.replace("/");
  }
}
function getCurrentArticle() {
  articleDetailQuery.refetch();
}

function commentChange() {
  articleCommentsQuery.refetch();
}

function commentAdded() {
  paginationCommentPage.value = 1;
  commentChange();
}

function commentDeleted() {
  // When last comment on the page other than 1 deleted
  // we should go back to the previous page to avoid accessing empty page
  if (
    paginationCommentPage.value !== 1 &&
    (articleCommentsQuery.data.value?.data.length ?? 0) === 1
  ) {
    paginationCommentPage.value--;
    return;
  }
  commentChange();
}
</script>
<template>
  <div
    v-if="articleDetailQuery.isError.value"
    class="flex h-full w-full items-center justify-center"
  >
    <h2 class="text-destructive text-4xl font-bold italic">
      🚨
      {{
        articleDetailQuery.error.value instanceof Error
          ? articleDetailQuery.error.value.message
          : "Failed to load article"
      }}
      🚨
    </h2>
  </div>
  <div v-if="articleDetail">
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
          @like-change="getCurrentArticle"
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
      @submit-success="commentAdded"
    />
    <div class="p-2">
      <p v-if="articleCommentsQuery.isLoading.value">Loading comments...</p>
      <p v-else-if="(articleCommentsQuery.data.value?.data.length ?? 0) === 0">
        No comment yet, become the first one!
      </p>
      <template v-else>
        <Comment
          v-for="comment in articleCommentsQuery.data.value?.data"
          :key="comment.id"
          :comment-id="comment.id"
          :author-name="comment.author_username"
          :content="comment.content"
          :created-at="comment.created_at"
          :show-action="
            !!userStore.profile &&
            comment.author_id === userStore.profile.user_id
          "
          class="mb-4"
          @comment-change="commentChange"
          @comment-deleted="commentDeleted"
        />

        <Pagination
          v-if="articleDetail"
          :total-pages="articleCommentsQuery.data.value?.total_pages"
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
