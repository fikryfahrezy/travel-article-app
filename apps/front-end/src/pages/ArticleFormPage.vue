<script setup lang="ts">
import Button from "@/components/Button.vue";
import MarkdownPreview from "@/components/MarkdownPreview.vue";
import {
  articleFormSchema,
  type ArticleFormFieldErrors,
} from "@/features/article/schemas";
import { useArticleStore } from "@/features/article/stores/article";
import type { MutationResDto, Result } from "@/lib/api-sdk.types";
import { useArticleFormStore } from "@/stores/article-form";
import { useToastStore } from "@/stores/toast";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import z from "zod";

const router = useRouter();
const articleStore = useArticleStore();
const toastStore = useToastStore();

const route = useRoute();
const articleId = String(route.params.articleId || "");

let initialTitle = "";
let initialMarkdownContent = "";
if (articleId) {
  const article = await articleStore.getArticle({
    idOrSlug: articleId,
  });

  if (article.success) {
    initialTitle = article.data.title;
    initialMarkdownContent = article.data.content;
  }
}

const articleFormStore = useArticleFormStore();

const title = ref(initialTitle);
const markdownContent = ref(initialMarkdownContent);

const fieldErrors = ref<ArticleFormFieldErrors>();

async function onSubmit() {
  const articleForm = articleFormSchema.safeParse({
    title: title.value,
    content: markdownContent.value,
  });

  if (!articleForm.success) {
    fieldErrors.value = z.flattenError(articleForm.error).fieldErrors;
    return;
  }

  let articleResult: Result<MutationResDto> | null = null;
  if (articleId) {
    articleResult = await articleStore.updateArticle({
      ...articleForm.data,
      article_id: articleId,
    });
  } else {
    articleResult = await articleStore.createArticle(articleForm.data);
  }
  if (!articleResult.success) {
    toastStore.showToast("error", articleResult.error.message);
    return;
  }

  toastStore.showToast(
    "success",
    articleId ? "Successfully edit article." : "Successfully create article.",
  );
  router.push("/articles");
}
</script>

<template>
  <form class="flex w-full flex-[1] flex-col gap-4" @submit.prevent="onSubmit">
    <div
      v-if="articleFormStore.activeTab === 'editor'"
      class="flex w-full flex-[1] flex-col gap-4"
    >
      <input
        id="title"
        v-model="title"
        type="text"
        placeholder="Title"
        class="outline-none"
        :aria-invalid="!!fieldErrors?.title"
      />
      <ul>
        <li
          v-for="error in fieldErrors?.title || []"
          :key="error"
          class="text-destructive"
        >
          {{ error }}
        </li>
      </ul>
      <textarea
        id="content"
        v-model="markdownContent"
        name="content"
        class="flex-[1] outline-none"
        placeholder=" Write markdown here"
        :aria-invalid="!!fieldErrors?.content"
      ></textarea>

      <ul>
        <li
          v-for="error in fieldErrors?.content || []"
          :key="error"
          class="text-destructive"
        >
          {{ error }}
        </li>
      </ul>
    </div>
    <MarkdownPreview
      v-if="articleFormStore.activeTab === 'preview'"
      :markdown-title="title"
      :markdown-content="markdownContent"
      class="overflow-y-scroll"
    />
    <Button type="submit" class="w-full lg:ml-auto lg:w-fit">
      {{ articleId ? "Edit" : "Post" }}
    </Button>
  </form>
</template>
