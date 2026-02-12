<script setup lang="ts">
import Button from "@/components/Button.vue";
import ChevronLeftIcon from "@/components/ChevronLeftIcon.vue";
import ChevronRightIcon from "@/components/ChevronRightIcon.vue";
import Pagination from "@/components/Pagination.vue";
import Article from "@/features/article/components/Article.vue";
import { useArticleStore } from "@/features/article/stores/article";
import { useUserStore } from "@/features/auth/stores/user";
import type { PaginationReqDto } from "@/lib/api-sdk.types";
import { computed, reactive, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const { isAuthenticated } = useUserStore();
const { allArticle, getAllArticle } = useArticleStore();

const paginationReq = reactive<Required<PaginationReqDto>>({
  limit: 36,
  page: Number(route.query.page || 1),
});

watch(
  () => route.query.page,
  (newPage) => {
    const newPageNumber = Number(String(newPage || 1));

    paginationReq.page = newPageNumber;
    getAllArticle({
      ...paginationReq,
      page: newPageNumber,
    });
  },
  { immediate: true },
);

const prevPage = computed(() => {
  return paginationReq.page <= 1 ? 1 : paginationReq.page - 1;
});

const nextPage = computed(() => {
  return paginationReq.page >= allArticle.total_pages
    ? allArticle.total_pages
    : paginationReq.page + 1;
});
</script>

<template>
  <div
    v-if="allArticle.data.length !== 0"
    class="grid grid-cols-1 gap-4 p-2 lg:grid-cols-3"
  >
    <Article
      v-for="article in allArticle.data"
      :key="article.id"
      class="w-full lg:h-44 lg:w-fit lg:max-w-96"
      :show-like-button="isAuthenticated"
      :article-id="article.id"
      :liked="article.liked"
      :title="article.title"
      :slug="article.slug"
      :author-name="article.author_username"
      :created-at="article.created_at"
      @like-change="getAllArticle(paginationReq)"
    />
  </div>
  <div v-else class="flex flex-[1] items-center justify-center">
    <h2 class="text-primary text-4xl font-bold italic">Empty Articles... 🍃</h2>
  </div>
  <Teleport to="#page-layout">
    <Pagination
      :total-pages="allArticle.total_pages"
      class="sticky bottom-0 mx-auto w-fit py-5"
    >
      <template #prev-button>
        <RouterLink
          v-slot="{ href, navigate }"
          custom
          :to="{ query: { ...$route.query, page: prevPage } }"
        >
          <Button
            as="a"
            :href="href"
            :disabled="paginationReq.page <= prevPage"
            @click="navigate"
          >
            <ChevronLeftIcon />
          </Button>
        </RouterLink>
      </template>
      <template #page-item="{ page }">
        <RouterLink
          v-slot="{ href, navigate }"
          custom
          :to="{ query: { ...$route.query, page } }"
        >
          <Button
            as="a"
            :href="href"
            :disabled="paginationReq.page === page"
            @click="navigate"
          >
            {{ page }}
          </Button>
        </RouterLink>
      </template>
      <template #next-button>
        <RouterLink
          v-slot="{ href, navigate }"
          custom
          :to="{ query: { ...$route.query, page: nextPage } }"
        >
          <Button
            as="a"
            :href="href"
            :disabled="paginationReq.page >= nextPage"
            @click="navigate"
          >
            <ChevronRightIcon />
          </Button>
        </RouterLink>
      </template>
    </Pagination>
  </Teleport>
</template>
