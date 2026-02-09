<script setup lang="ts">
import MyButton from "#layers/my-base/app/components/MyButton.vue";
import MyModal from "#layers/my-base/app/components/MyModal.vue";
import { useMutationStateStore } from "#layers/my-base/app/composables/mutation-state";
import CommentFormEdit from "./CommentFormEdit.vue";
import {
  commentKeys,
  useDeleteComment,
} from "#layers/my-article/app/composables/comment";

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

const { getState: getMutationState } = useMutationStateStore();
const lastCommentUpdateStatus = getMutationState(
  commentKeys.update().toString(),
);

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
      <MyButton background="text" @click="editMode = !editMode">Edit</MyButton>
      <MyButton
        background="text"
        variant="destructive"
        @click="showDeleteConfirmation = true"
      >
        Delete
      </MyButton>
    </div>
  </div>
  <MyModal
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
      <MyButton
        class="w-full lg:w-fit"
        variant="neutral"
        @click="showDeleteConfirmation = false"
      >
        Cancel
      </MyButton>
    </template>
    <template #confirm-button>
      <MyButton
        class="w-full lg:w-fit"
        variant="destructive"
        @click="onDeleteComment"
      >
        Confirm
      </MyButton>
    </template>
  </MyModal>
</template>
