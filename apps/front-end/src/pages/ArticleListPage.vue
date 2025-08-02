<script setup lang="ts">
import Button from "@/components/Button.vue";
import ChevronLeftIcon from "@/components/ChevronLeftIcon.vue";
import ChevronRightIcon from "@/components/ChevronRightIcon.vue";
import Pagination from "@/components/Pagination.vue";
import Article from "@/features/article/components/Article.vue";
import { useArticleStore } from "@/features/article/stores/article";
import { useUserStore } from "@/features/auth/stores/user";
import type { PaginationReqDto } from "@/lib/api-sdk.types";
import { computed, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const userStore = useUserStore();
const articleStore = useArticleStore();

const currentPage = ref(1);

const paginationReq = reactive<Required<PaginationReqDto>>({
  limit: 10,
  page: 1,
});

articleStore.getAllArticle(paginationReq);

watch(
  () => route.query.page,
  (newPage) => {
    const newPageNumber = Number(String(newPage || 1));

    currentPage.value = newPageNumber;
    articleStore.getAllArticle({
      ...paginationReq,
      page: newPageNumber,
    });
  },
);

const prevPage = computed(() => {
  return currentPage.value <= 1 ? 1 : currentPage.value - 1;
});

const nextPage = computed(() => {
  return currentPage.value >= articleStore.allArticle.total_pages
    ? articleStore.allArticle.total_pages
    : currentPage.value + 1;
});
</script>

<template>
  <div v-if="userStore.isAuthenticated" class="flex justify-end">
    <RouterLink v-slot="{ href, navigate }" custom to="/articles/form">
      <Button as="a" :href="href" class="w-full lg:w-fit" @click="navigate">
        Contribute Your Story
      </Button>
    </RouterLink>
  </div>

  <div
    v-if="articleStore.allArticle.data.length !== 0"
    class="flex h-full flex-col content-start gap-4 overflow-y-scroll p-2 lg:flex-row lg:flex-wrap"
  >
    <Article
      v-for="article in articleStore.allArticle.data"
      :key="article.id"
      class="w-full lg:h-44 lg:w-fit lg:max-w-96"
      :show-like-button="userStore.isAuthenticated"
      :article-id="article.id"
      :liked="article.liked"
      :title="article.title"
      :slug="article.slug"
      :author-name="article.author_username"
      :created-at="article.created_at"
      @like-change="articleStore.getAllArticle(paginationReq)"
    />
  </div>
  <div v-else class="flex h-full items-center justify-center">
    <h2 class="text-primary text-4xl font-bold italic">Empty Articles... 🍃</h2>
  </div>
  <Pagination
    :total-pages="articleStore.allArticle.total_pages"
    class="mx-auto w-fit"
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
          :disabled="currentPage <= prevPage"
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
          :disabled="currentPage === page"
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
          :disabled="currentPage >= nextPage"
          @click="navigate"
        >
          <ChevronRightIcon />
        </Button>
      </RouterLink>
    </template>
  </Pagination>
</template>
