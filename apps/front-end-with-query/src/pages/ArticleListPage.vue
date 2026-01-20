<script setup lang="ts">
import Button from "@/components/Button.vue";
import ChevronLeftIcon from "@/components/ChevronLeftIcon.vue";
import ChevronRightIcon from "@/components/ChevronRightIcon.vue";
import Pagination from "@/components/Pagination.vue";
import Article from "@/features/article/components/Article.vue";
import { useUserStore } from "@/features/auth/stores/user";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { apiSdk } from "@/lib/api-sdk";
import type { Result, GetAllArticleResDto } from "@/lib/api-sdk.types";
import LoadingOverlay from "@/components/LoadingOverlay.vue";

const route = useRoute();
const userStore = useUserStore();

const paginationLimit = 10;
const paginationPage = computed(() => {
  return Number(route.query.page || 1);
});

const {
  data: articlesData,
  isLoading,
  isError,
  error,
  refetch,
} = useQuery<Result<GetAllArticleResDto>>({
  queryKey: computed(() => {
    return ["articles", paginationPage.value, paginationLimit];
  }),
  queryFn: () => {
    return apiSdk.getAllArticle({
      limit: paginationLimit,
      page: paginationPage.value,
    });
  },
});

const prevPage = computed(() => {
  return paginationPage.value <= 1 ? 1 : paginationPage.value - 1;
});

const nextPage = computed(() => {
  const result = articlesData.value;
  const totalPages = result && result.success ? result.data.total_pages : 1;
  return paginationPage.value >= totalPages
    ? totalPages
    : paginationPage.value + 1;
});
</script>

<template>
  <Teleport v-if="userStore.isAuthenticated" to="#nav-bar">
    <div class="flex justify-end py-3">
      <RouterLink v-slot="{ href, navigate }" custom to="/articles/form">
        <Button as="a" :href="href" class="w-full lg:w-fit" @click="navigate">
          Contribute Your Story
        </Button>
      </RouterLink>
    </div>
  </Teleport>

  <LoadingOverlay v-if="isLoading" />

  <div v-else-if="isError" class="flex h-full items-center justify-center">
    <h2 class="text-2xl font-bold text-red-500 italic">
      Error: {{ error?.message || "Failed to load articles." }}
    </h2>
  </div>
  <div
    v-else-if="
      articlesData && articlesData.success && articlesData.data.data.length
    "
    class="grid h-full grid-cols-1 gap-4 p-2 lg:grid-cols-3"
  >
    <Article
      v-for="article in articlesData.data.data"
      :key="article.id"
      class="w-full lg:h-44 lg:w-fit lg:max-w-96"
      :show-like-button="userStore.isAuthenticated"
      :article-id="article.id"
      :liked="article.liked"
      :title="article.title"
      :slug="article.slug"
      :author-name="article.author_username"
      :created-at="article.created_at"
      @like-change="refetch()"
    />
  </div>
  <div v-else class="flex h-full items-center justify-center">
    <h2 class="text-primary text-4xl font-bold italic">Empty Articles... 🍃</h2>
  </div>
  <Teleport to="#page-layout">
    <Pagination
      :total-pages="
        articlesData && articlesData.success ? articlesData.data.total_pages : 1
      "
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
            :disabled="paginationPage <= prevPage"
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
            :disabled="paginationPage === page"
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
            :disabled="paginationPage >= nextPage"
            @click="navigate"
          >
            <ChevronRightIcon />
          </Button>
        </RouterLink>
      </template>
    </Pagination>
  </Teleport>
</template>
