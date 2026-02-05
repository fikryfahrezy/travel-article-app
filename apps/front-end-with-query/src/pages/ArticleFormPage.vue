<script setup lang="ts">
import Button from "@/components/Button.vue";
import MarkdownPreview from "@/components/MarkdownPreview.vue";
import {
  articleFormSchema,
  type ArticleFormFieldErrors,
} from "@/features/article/schemas";
import { useToastStore } from "@/stores/toast";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import z from "zod";
import {
  useCreateArticle,
  useUpdateArticle,
  useArticleDetail,
} from "@/features/article/composables/article";
import { useArticleFormStore } from "@/stores/article-form";

const router = useRouter();
const route = useRoute();
const articleId = computed(() => {
  return String(route.params.articleId || "");
});

const toastStore = useToastStore();

const { mutateAsync: createArticle } = useCreateArticle();
const { mutateAsync: updateArticle } = useUpdateArticle();
const { data: articleDetail } = useArticleDetail(articleId);

const articleFormStore = useArticleFormStore();

const _title = ref("");
const title = computed({
  get: () => {
    return articleDetail.value ? articleDetail.value.title : _title.value;
  },
  set: (val: string) => {
    _title.value = val;
  },
});

const _markdownContent = ref("");
const markdownContent = computed({
  get: () => {
    return articleDetail.value
      ? articleDetail.value.content
      : _markdownContent.value;
  },
  set: (val: string) => {
    _markdownContent.value = val;
  },
});

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

  const mutationFn = articleId.value ? updateArticle : createArticle;

  try {
    const articleIdStr = articleId.value ? articleId.value : "";
    await mutationFn({
      ...articleForm.data,
      article_id: articleIdStr,
    });
    toastStore.showToast(
      "success",
      articleIdStr
        ? "Successfully edit article."
        : "Successfully create article.",
    );
    router.push("/articles");
  } catch (error) {
    toastStore.showToast("error", String(error));
  }
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
