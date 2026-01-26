<script setup lang="ts">
import Button from "@/components/Button.vue";
import Modal from "@/components/Modal.vue";
import { computed, ref, watch } from "vue";
import CommentFormEdit from "./CommentFormEdit.vue";
import { commentKeys, useDeleteComment } from "../stores/comment";
import { useMutationState } from "@tanstack/vue-query";

const editMode = ref(false);
const showDeleteConfirmation = ref(false);
const { mutateAsync: deleteComment } = useDeleteComment();

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
}

const commentUpdateStatus = useMutationState({
  filters: { mutationKey: commentKeys.update() },
  select: (mutation) => {
    return mutation.state.status;
  },
});

const lastCommentUpdateStatus = computed(() => {
  const status = commentUpdateStatus.value;
  return status[status.length - 1];
});

watch(lastCommentUpdateStatus, (lastStatus) => {
  if (lastStatus === "success") {
    commentChange();
  }
});

async function onDeleteComment() {
  await deleteComment({
    comment_id: props.commentId,
  });
}
</script>
<template>
  <CommentFormEdit
    v-if="editMode"
    class="mb-4"
    :comment-id="commentId"
    :content="content"
  />
  <div v-else class="flex flex-col">
    <p class="font-medium">{{ authorName }}</p>

    <p class="text-xs">
      {{ new Intl.DateTimeFormat().format(new Date(createdAt)) }}
    </p>
    <p class="line-clamp-2">
      {{ content }}
    </p>
    <div v-if="showAction" class="ml-auto">
      <Button background="text" @click="editMode = !editMode">Edit</Button>
      <Button
        background="text"
        variant="destructive"
        @click="showDeleteConfirmation = true"
      >
        Delete
      </Button>
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
        @click="onDeleteComment"
      >
        Confirm</Button
      >
    </template>
  </Modal>
</template>
