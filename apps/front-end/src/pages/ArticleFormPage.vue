<script setup lang="ts">
import Button from "@/components/Button.vue";
import MarkdownPreview from "@/components/MarkdownPreview.vue";
import {
  articleFormSchema,
  type ArticleFormFieldErrors,
} from "@/features/article/schemas";
import { useArticleStore } from "@/features/article/stores/article";
import { useToastStore } from "@/stores/toast";
import { ref } from "vue";
import z from "zod";
import router from "./router";

const articleStore = useArticleStore();
const toastStore = useToastStore();

const tabs = ["editor", "preview"] as const;
const activeTab = ref<(typeof tabs)[number]>("editor");

const title = ref("");
const markdownContent = ref("");

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

  const loginResult = await articleStore.createArticle(articleForm.data);
  if (!loginResult.success) {
    toastStore.showToast("error", loginResult.error.message);
    return;
  }

  toastStore.showToast("success", "Successfully create article.");
  router.push("/articles");
}
</script>

<template>
  <div>
    <Button
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
    </Button>
    <Button background="text"></Button>
  </div>
  <form
    class="flex h-full w-full flex-col gap-4 overflow-scroll"
    @submit.prevent="onSubmit"
  >
    <div
      v-if="activeTab === 'editor'"
      class="flex h-full w-full flex-col gap-4"
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
        <ul
          v-for="error in fieldErrors?.title || []"
          :key="error"
          class="text-destructive"
        >
          {{
            error
          }}
        </ul>
      </ul>
      <textarea
        id="content"
        v-model="markdownContent"
        name="content"
        class="h-full outline-none"
        placeholder=" Write markdown here"
        :aria-invalid="!!fieldErrors?.content"
      ></textarea>

      <ul>
        <ul
          v-for="error in fieldErrors?.content || []"
          :key="error"
          class="text-destructive"
        >
          {{
            error
          }}
        </ul>
      </ul>
    </div>
    <MarkdownPreview
      v-if="activeTab === 'preview'"
      :markdown-title="title"
      :markdown-content="markdownContent"
      class="overflow-scroll"
    />
    <Button type="submit" class="w-full lg:ml-auto lg:w-fit">Post</Button>
  </form>
</template>
