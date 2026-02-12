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
import { useArticleStore } from "@/features/article/stores/article";
import { useCommentStore } from "@/features/article/stores/comment";
import { useUserStore } from "@/features/auth/stores/user";
import type { PaginationReqDto } from "@/lib/api-sdk.types";
import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const { profile, isAuthenticated } = useUserStore();
const { detail, getArticle, deleteArticle, detailError } = useArticleStore();
const { getAllArticleComment, allArticleComment } = useCommentStore();

const showDeleteConfirmation = ref(false);

const articleSlug = computed(() => {
  return String(route.params.articleSlug);
});

const paginationCommentReq = reactive<Required<PaginationReqDto>>({
  limit: 10,
  page: 1,
});

function getCurrentArticle() {
  getArticle({
    idOrSlug: articleSlug.value,
  });
}

function onGetAllArticleComment(page: number) {
  if (!detail) {
    return;
  }
  getAllArticleComment({
    article_id: detail.id,
    pagination: { ...paginationCommentReq, page },
  });
}

watch(
  () => articleSlug,
  () => {
    getCurrentArticle();
  },
  { immediate: true },
);

watch([() => detail, () => paginationCommentReq.page], ([, page]) => {
  onGetAllArticleComment(page);
});

const prevCommentPage = computed(() => {
  return paginationCommentReq.page <= 1 ? 1 : paginationCommentReq.page - 1;
});

const nextCommentPage = computed(() => {
  return paginationCommentReq.page >= allArticleComment.total_pages
    ? allArticleComment.total_pages
    : paginationCommentReq.page + 1;
});

const allowedToModifyArticle = computed(() => {
  return !!profile && !!detail && profile.user_id === detail.author_id;
});

async function onDeleteArticle() {
  if (detail) {
    await deleteArticle({ article_id: detail.id });
    router.replace("/articles");
  }
}
function commentChange() {
  onGetAllArticleComment(paginationCommentReq.page);
}

function commentDeleted() {
  // When last comment on the page other that 1 deleted
  //  we should back to the previous page to avoid acessing empty page
  if (paginationCommentReq.page !== 1 && allArticleComment.data.length === 1) {
    paginationCommentReq.page--;
    return;
  }
  commentChange();
}
</script>
<template>
  <div
    v-if="detailError"
    class="flex w-full flex-[1] items-center justify-center"
  >
    <h2 class="text-destructive text-4xl font-bold italic">
      🚨 {{ detailError.message }} 🚨
    </h2>
  </div>
  <div v-else-if="detail">
    <div class="flex items-start justify-between">
      <div class="flex gap-2">
        <p>
          {{ detail.author_username }}
        </p>
        <p>
          {{ new Intl.DateTimeFormat().format(new Date(detail.created_at)) }}
        </p>
      </div>
      <div class="flex gap-2">
        <ArticleLikeButton
          v-if="isAuthenticated"
          :article-id="detail.id"
          :liked="detail.liked"
          @like-change="getCurrentArticle"
        />
        <RouterLink
          v-if="allowedToModifyArticle"
          v-slot="{ href, navigate }"
          custom
          :to="'/articles/form/' + detail.id"
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
      :markdown-title="detail.title"
      :markdown-content="detail.content"
    />

    <CommentFormCreate
      v-if="isAuthenticated"
      class="mb-4"
      :article-id="detail.id"
      @submit-success="getAllArticleComment"
    />
    <div class="flex flex-col gap-4 p-2">
      <p v-if="allArticleComment.data.length === 0">
        No comment yet, become the first one!
      </p>
      <template v-else>
        <Comment
          v-for="comment in allArticleComment.data"
          :key="comment.id"
          :comment-id="comment.id"
          :author-name="comment.author_username"
          :content="comment.content"
          :created-at="comment.created_at"
          :show-action="!!profile && comment.author_id === profile.user_id"
          @comment-change="commentChange"
          @comment-deleted="commentDeleted"
        />

        <Pagination
          v-if="detail"
          :total-pages="allArticleComment.total_pages"
          class="mx-auto w-fit"
        >
          <template #prev-button>
            <Button
              :disabled="allArticleComment.page <= prevCommentPage"
              @click="paginationCommentReq.page--"
            >
              <ChevronLeftIcon />
            </Button>
          </template>
          <template #page-item="{ page }">
            <Button
              :disabled="allArticleComment.page === page"
              @click="paginationCommentReq.page = page"
            >
              {{ page }}
            </Button>
          </template>
          <template #next-button>
            <Button
              :disabled="allArticleComment.page >= nextCommentPage"
              @click="paginationCommentReq.page++"
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
        @click="onDeleteArticle"
      >
        Confirm
      </Button>
    </template>
  </Modal>
</template>
