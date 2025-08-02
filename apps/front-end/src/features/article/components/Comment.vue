<script setup lang="ts">
import Button from "@/components/Button.vue";
import { ref } from "vue";
import CommentFormEdit from "./CommentFormEdit.vue";

const editMode = ref(false);

const emit = defineEmits(["commentChange"]);

defineProps({
  commentId: {
    type: String,
    default: "",
  },
  content: {
    type: String,
    default: "",
  },
  showAction: {
    type: Boolean,
    required: true,
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

function commentChange() {
  editMode.value = false;
  emit("commentChange");
}
</script>
<template>
  <CommentFormEdit
    v-if="editMode"
    class="mb-4"
    :comment-id="commentId"
    :content="content"
    @submit-success="commentChange"
  />
  <div v-else :class="['flex flex-col', $attrs.class]">
    <p class="font-medium">{{ authorName }}</p>

    <p class="text-xs">
      {{ new Intl.DateTimeFormat().format(new Date(createdAt)) }}
    </p>
    <p class="line-clamp-2 h-full">
      {{ content }}
    </p>
    <div v-if="showAction" class="ml-auto">
      <Button background="text" @click="editMode = !editMode">Edit</Button>
      <Button background="text" variant="destructive">Delete</Button>
    </div>
  </div>
</template>
