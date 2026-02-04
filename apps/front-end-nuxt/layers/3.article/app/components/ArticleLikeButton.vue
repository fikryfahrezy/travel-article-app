<script setup lang="ts">
import MyButton from "#layers/my-base/app/components/MyButton.vue";
import HeartIcon from "#layers/my-base/app/components/HeartIcon.vue";
import HeartOffIcon from "#layers/my-base/app/components/HeartOffIcon.vue";
import { useLikeArticle } from "#layers/my-article/app/composables/article";

const { mutateAsync: likeArticle } = useLikeArticle();

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
  await likeArticle({
    article_id: props.articleId,
    like: !props.liked,
  });
}
</script>
<template>
  <MyButton
    background="text"
    :variant="liked ? 'destructive' : 'primary'"
    @click="onClick"
  >
    <HeartOffIcon v-if="liked" />
    <HeartIcon v-else />
  </MyButton>
</template>
