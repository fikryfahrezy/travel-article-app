<script setup lang="ts">
import MyButton from "#layers/my-base/app/components/MyButton.vue";
import MarkdownPreview from "#layers/my-base/app/components/MarkdownPreview.vue";
import {
  articleFormSchema,
  type ArticleFormFieldErrors,
} from "#layers/my-article/app/schemas/article.schema";
import { useToastStore } from "#layers/my-base/app/composables/toast";
import z from "zod";
import {
  useCreateArticle,
  useUpdateArticle,
  useArticleDetail,
} from "#layers/my-article/app/composables/article";

definePageMeta({
  middleware: ["authenticated"],
});

const route = useRoute();
const articleId = computed(() => {
  return String(route.params.articleId || "");
});

const toastStore = useToastStore();

const { mutateAsync: createArticle } = useCreateArticle();
const { mutateAsync: updateArticle } = useUpdateArticle();
const { data: articleDetail } = useArticleDetail(articleId);

const tabs = ["editor", "preview"] as const;
const activeTab = ref<(typeof tabs)[number]>("editor");

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
    await navigateTo("/articles");
  } catch (error) {
    toastStore.showToast("error", String(error));
  }
}
</script>

<template>
  <Teleport to="#nav-bar">
    <div>
      <MyButton
        v-for="tab in tabs"
        :key="tab"
        background="text"
        :variant="activeTab === tab ? 'primary' : 'neutral'"
        :class="[
          'w-1/2 border-b-2 capitalize',
          activeTab === tab ? 'border-b-primary' : 'border-b-neutral-400',
        ]"
        @click="activeTab = tab"
      >
        {{ tab }}
      </MyButton>
    </div>
  </Teleport>
  <form
    class="flex w-full flex-[1] flex-col gap-4 overflow-y-scroll"
    @submit.prevent="onSubmit"
  >
    <div
      v-if="activeTab === 'editor'"
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
      v-if="activeTab === 'preview'"
      :markdown-title="title"
      :markdown-content="markdownContent"
      class="overflow-y-scroll"
    />
    <MyButton type="submit" class="w-full lg:ml-auto lg:w-fit">
      {{ articleId ? "Edit" : "Post" }}
    </MyButton>
  </form>
</template>
