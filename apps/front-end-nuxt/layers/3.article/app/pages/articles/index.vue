<script setup lang="ts">
import MyButton from "#layers/my-base/app/components/MyButton.vue";
import ChevronLeftIcon from "#layers/my-base/app/components/ChevronLeftIcon.vue";
import ChevronRightIcon from "#layers/my-base/app/components/ChevronRightIcon.vue";
import MyPagination from "#layers/my-base/app/components/MyPagination.vue";
import Article from "#layers/my-article/app/components/Article.vue";
import { useArticles } from "#layers/my-article/app/composables/article";

definePageMeta({
  layout: "articles",
});

const route = useRoute();
const { loggedIn } = useUserSession();

const paginationPage = computed(() => {
  return Number(route.query.page || 1);
});

const {
  data: articlesData,
  status: articlesStatus,
  error: articlesError,
} = await useArticles(paginationPage, 36);

const prevPage = computed(() => {
  return paginationPage.value <= 1 ? 1 : paginationPage.value - 1;
});

const nextPage = computed(() => {
  const result = articlesData.value;
  const totalPages = result ? result.total_pages : 1;
  return paginationPage.value >= totalPages
    ? totalPages
    : paginationPage.value + 1;
});
</script>

<template>
  <div
    v-if="articlesStatus === 'error'"
    class="flex flex-[1] items-center justify-center"
  >
    <h2 class="text-2xl font-bold text-red-500 italic">
      Error: {{ articlesError?.message || "Failed to load articles." }}
    </h2>
  </div>
  <div
    v-else-if="articlesData"
    class="grid grid-cols-1 gap-4 p-2 lg:grid-cols-3"
  >
    <Article
      v-for="article in articlesData.data"
      :key="article.id"
      class="w-full lg:h-44 lg:w-fit lg:max-w-96"
      :show-like-button="loggedIn"
      :article-id="article.id"
      :liked="article.liked"
      :title="article.title"
      :slug="article.slug"
      :author-name="article.author_username"
      :created-at="article.created_at"
    />
  </div>
  <div v-else class="flex flex-[1] items-center justify-center">
    <h2 class="text-primary text-4xl font-bold italic">Empty Articles... 🍃</h2>
  </div>
  <ClientOnly>
    <Teleport to="#page-layout">
      <MyPagination
        :total-pages="articlesData && articlesData.total_pages"
        class="sticky bottom-0 mx-auto w-fit py-5"
      >
        <template #prev-button>
          <RouterLink
            v-slot="{ href, navigate }"
            custom
            :to="{ query: { ...$route.query, page: prevPage } }"
          >
            <MyButton
              as="a"
              :href="href"
              :disabled="paginationPage <= prevPage"
              @click="navigate"
            >
              <ChevronLeftIcon />
            </MyButton>
          </RouterLink>
        </template>
        <template #page-item="{ page }">
          <RouterLink
            v-slot="{ href, navigate }"
            custom
            :to="{ query: { ...$route.query, page } }"
          >
            <MyButton
              as="a"
              :href="href"
              :disabled="paginationPage === page"
              @click="navigate"
            >
              {{ page }}
            </MyButton>
          </RouterLink>
        </template>
        <template #next-button>
          <RouterLink
            v-slot="{ href, navigate }"
            custom
            :to="{ query: { ...$route.query, page: nextPage } }"
          >
            <MyButton
              as="a"
              :href="href"
              :disabled="paginationPage >= nextPage"
              @click="navigate"
            >
              <ChevronRightIcon />
            </MyButton>
          </RouterLink>
        </template>
      </MyPagination>
    </Teleport>
  </ClientOnly>
</template>
