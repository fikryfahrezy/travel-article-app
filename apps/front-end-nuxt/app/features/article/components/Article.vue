<script setup lang="ts">
import ArrowRightIcon from "@/components/ArrowRightIcon.vue";
import ArticleLikeButton from "./ArticleLikeButton.vue";

const emit = defineEmits(["likeChange"]);

defineProps({
  showLikeButton: {
    type: Boolean,
    default: false,
  },
  articleId: {
    type: String,
    required: true,
  },
  liked: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  slug: {
    type: String,
    default: "",
  },
  authorName: {
    type: String,
    default: "",
  },
  createdAt: {
    type: String,
    default: "",
  },
});
</script>
<template>
  <article
    :class="[
      'hover:ring-primary flex flex-col gap-2 p-2 hover:ring-2',
      $attrs.class,
    ]"
  >
    <div class="flex items-start justify-between gap-4">
      <h3 class="text-primary line-clamp-2 text-2xl font-bold">
        {{ title }}
      </h3>
      <ArticleLikeButton
        v-if="showLikeButton"
        :article-id="articleId"
        :liked="liked"
        @like-change="emit('likeChange')"
      />
    </div>
    <p class="font-medium">{{ authorName }}</p>
    <p class="text-xs">
      {{ new Intl.DateTimeFormat().format(new Date(createdAt)) }}
    </p>
    <RouterLink
      :to="'/articles/' + slug"
      class="text-primary flex items-center gap-4 text-sm"
    >
      <span>Continue Reading </span>
      <ArrowRightIcon class="size-5" />
    </RouterLink>
  </article>
</template>
