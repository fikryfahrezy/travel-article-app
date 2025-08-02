<script setup lang="ts">
import Button from "@/components/Button.vue";
import HeartIcon from "@/components/HeartIcon.vue";
import HeartOffIcon from "@/components/HeartOffIcon.vue";
import { useArticleStore } from "../stores/article";

const articleStore = useArticleStore();

const emit = defineEmits(["likeChange"]);

const props = defineProps({
  articleId: {
    type: String,
    required: true,
  },
  liked: {
    type: Boolean,
    default: false,
  },
});

async function onClick() {
  await articleStore.likeArticle({
    article_id: props.articleId,
    like: !props.liked,
  });
  emit("likeChange");
}
</script>
<template>
  <Button
    background="text"
    :variant="liked ? 'destructive' : 'primary'"
    @click="onClick"
  >
    <HeartOffIcon v-if="liked" />
    <HeartIcon v-else />
  </Button>
</template>
