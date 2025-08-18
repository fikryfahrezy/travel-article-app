<script setup lang="ts">
import Button from "@/components/Button.vue";
import Modal from "@/components/Modal.vue";
import { ref } from "vue";
import { useCommentStore } from "../stores/comment";
import CommentFormEdit from "./CommentFormEdit.vue";

const editMode = ref(false);
const showDeleteConfirmation = ref(false);

const commentStore = useCommentStore();

const emit = defineEmits(["commentChange", "commentDeleted"]);

const props = defineProps({
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

async function deleteComment() {
  await commentStore.deleteArticleComment({
    comment_id: props.commentId,
  });
  emit("commentDeleted");
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
      <Button
        background="text"
        variant="destructive"
        @click="showDeleteConfirmation = true"
        >Delete</Button
      >
    </div>
  </div>
  <Modal
    v-if="showDeleteConfirmation"
    title="🚨 Alert"
    @close="showDeleteConfirmation = false"
  >
    <template #content>
      <p class="font-medium">
        Are you sure want to delete the article comment?
      </p>
    </template>
    <template #cancel-button>
      <Button
        class="w-full lg:w-fit"
        variant="neutral"
        @click="showDeleteConfirmation = false"
        >Cancel</Button
      >
    </template>
    <template #confirm-button>
      <Button
        class="w-full lg:w-fit"
        variant="destructive"
        @click="deleteComment"
      >
        Confirm</Button
      >
    </template>
  </Modal>
</template>
