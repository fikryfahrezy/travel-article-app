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
const userStore = useUserStore();
const articleStore = useArticleStore();
const commentStore = useCommentStore();

const showDeleteConfirmation = ref(false);

const articleSlug = String(route.params.articleSlug);

const paginationCommentReq = reactive<Required<PaginationReqDto>>({
  limit: 10,
  page: 1,
});

articleStore.getArticle({
  idOrSlug: articleSlug,
});

function getAllArticleComment(page: number) {
  if (!articleStore.detail) {
    return;
  }
  commentStore.getAllArticleComment({
    article_id: articleStore.detail.id,
    pagination: { ...paginationCommentReq, page },
  });
}

watch(
  [() => articleStore.detail, () => paginationCommentReq.page],
  ([, page]) => {
    getAllArticleComment(page);
  },
);

const prevCommentPage = computed(() => {
  return paginationCommentReq.page <= 1 ? 1 : paginationCommentReq.page - 1;
});

const nextCommentPage = computed(() => {
  return paginationCommentReq.page >= commentStore.allArticleComment.total_pages
    ? commentStore.allArticleComment.total_pages
    : paginationCommentReq.page + 1;
});

const allowedToModifyArticle = computed(() => {
  return (
    !!userStore.profile &&
    !!articleStore.detail &&
    userStore.profile.user_id === articleStore.detail.author_id
  );
});

async function deleteArticle() {
  if (articleStore.detail) {
    await articleStore.deleteArticle({ article_id: articleStore.detail.id });
    router.replace("/");
  }
}
function commentChange() {
  getAllArticleComment(paginationCommentReq.page);
}

function commentDeleted() {
  // When last comment on the page other that 1 deleted
  //  we should back to the previous page to avoid acessing empty page
  if (
    paginationCommentReq.page !== 1 &&
    commentStore.allArticleComment.data.length === 1
  ) {
    paginationCommentReq.page--;
    return;
  }
  commentChange();
}
</script>
<template>
  <div
    v-if="articleStore.detailError"
    class="flex h-full w-full items-center justify-center"
  >
    <h2 class="text-destructive text-4xl font-bold italic">
      🚨 {{ articleStore.detailError.message }} 🚨
    </h2>
  </div>
  <div v-if="articleStore.detail">
    <div class="flex items-start justify-between">
      <div class="flex gap-2">
        <p>
          {{ articleStore.detail.author_username }}
        </p>
        <p>
          {{
            new Intl.DateTimeFormat().format(
              new Date(articleStore.detail.created_at),
            )
          }}
        </p>
      </div>
      <div class="flex gap-2">
        <ArticleLikeButton
          v-if="userStore.isAuthenticated"
          :article-id="articleStore.detail.id"
          :liked="articleStore.detail.liked"
          @like-change="articleStore.getArticle({ idOrSlug: articleSlug })"
        />
        <RouterLink
          v-if="allowedToModifyArticle"
          v-slot="{ href, navigate }"
          custom
          :to="'/articles/form/' + articleStore.detail.id"
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
      :markdown-title="articleStore.detail.title"
      :markdown-content="articleStore.detail.content"
    />

    <CommentFormCreate
      v-if="userStore.isAuthenticated"
      class="mb-4"
      :article-id="articleStore.detail.id"
      @submit-success="getAllArticleComment"
    />
    <div v-if="commentStore.allArticleComment.data.length === 0">
      <p>No comment yet, become the first one!</p>
    </div>
    <div v-else class="p-2">
      <Comment
        v-for="comment in commentStore.allArticleComment.data"
        :key="comment.id"
        :comment-id="comment.id"
        :author-name="comment.author_username"
        :content="comment.content"
        :created-at="comment.created_at"
        :show-action="
          !!userStore.profile && comment.author_id === userStore.profile.user_id
        "
        class="mb-4"
        @comment-change="commentChange"
        @comment-deleted="commentDeleted"
      />

      <Pagination
        v-if="articleStore.detail"
        :total-pages="commentStore.allArticleComment.total_pages"
        class="mx-auto w-fit"
      >
        <template #prev-button>
          <Button
            :disabled="commentStore.allArticleComment.page <= prevCommentPage"
            @click="paginationCommentReq.page--"
          >
            <ChevronLeftIcon />
          </Button>
        </template>
        <template #page-item="{ page }">
          <Button
            :disabled="commentStore.allArticleComment.page === page"
            @click="paginationCommentReq.page = page"
          >
            {{ page }}
          </Button>
        </template>
        <template #next-button>
          <Button
            :disabled="commentStore.allArticleComment.page >= nextCommentPage"
            @click="paginationCommentReq.page++"
          >
            <ChevronRightIcon />
          </Button>
        </template>
      </Pagination>
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
