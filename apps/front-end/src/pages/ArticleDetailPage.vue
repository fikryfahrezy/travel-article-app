<script setup lang="ts">
import Button from "@/components/Button.vue";
import ChevronLeftIcon from "@/components/ChevronLeftIcon.vue";
import ChevronRightIcon from "@/components/ChevronRightIcon.vue";
import MarkdownPreview from "@/components/MarkdownPreview.vue";
import Pagination from "@/components/Pagination.vue";
import Comment from "@/features/article/components/Comment.vue";
import CommentForm from "@/features/article/components/CommentForm.vue";
import { useArticleStore } from "@/features/article/stores/article";
import { useCommentStore } from "@/features/article/stores/comment";
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const articleStore = useArticleStore();
const commentStore = useCommentStore();

const article = await articleStore.getArticle({
  slug: String(route.params.articleSlug),
});

if (article.success) {
  commentStore.getAllArticleComment({
    article_id: article.data.id,
    pagination: { page: 1 },
  });
}

const prevCommentPage = computed(() => {
  return commentStore.page <= 1 ? 1 : commentStore.page - 1;
});

const nextCommentPage = computed(() => {
  return commentStore.page >= commentStore.total_pages
    ? commentStore.total_pages
    : commentStore.page + 1;
});
</script>
<template>
  <div
    v-if="!article.success"
    class="flex h-full w-full items-center justify-center"
  >
    <h2 class="text-destructive text-4xl font-bold italic">
      🚨 {{ article.error.message }} 🚨
    </h2>
  </div>
  <div v-else>
    <MarkdownPreview
      :markdown-title="article.data.title"
      :markdown-content="article.data.content"
    />
    <CommentForm class="mb-4" :article-id="article.data.id" />
    <div v-if="commentStore.data.length === 0">
      <p>No comment yet, become the first one!</p>
    </div>
    <div v-else>
      <Comment
        v-for="comment in commentStore.data"
        :key="comment.id"
        :author-name="comment.author_username"
        :content="comment.content"
        :created-at="comment.created_at"
        class="mb-4"
      />

      <Pagination :total-pages="commentStore.total_pages" class="mx-auto w-fit">
        <template #prev-button>
          <Button :disabled="commentStore.page <= prevCommentPage">
            <ChevronLeftIcon />
          </Button>
        </template>
        <template #page-item="{ page }">
          <Button :disabled="commentStore.page === page">
            {{ page }}
          </Button>
        </template>
        <template #next-button>
          <Button :disabled="commentStore.page >= nextCommentPage">
            <ChevronRightIcon />
          </Button>
        </template>
      </Pagination>
    </div>
  </div>
</template>
