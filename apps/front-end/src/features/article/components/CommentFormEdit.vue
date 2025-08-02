<script setup lang="ts">
import Button from "@/components/Button.vue";
import Input from "@/components/Input.vue";
import { useToastStore } from "@/stores/toast";
import { ref, useTemplateRef } from "vue";
import z from "zod";
import { commentFormSchema, type CommentFormFieldErrors } from "../schemas";
import { useCommentStore } from "../stores/comment";

const emit = defineEmits(["submitSuccess"]);

const props = defineProps({
  commentId: {
    type: String,
    default: "",
  },
  content: {
    type: String,
    default: "",
  },
});

const commentStore = useCommentStore();
const toastStore = useToastStore();
const formRef = useTemplateRef("form-ref");

const fieldErrors = ref<CommentFormFieldErrors>();

async function onSubmit() {
  const formElement = formRef.value;
  if (!formElement) {
    return;
  }

  const formData = new FormData(formElement);
  const formValue = Object.fromEntries(formData.entries());
  const commentForm = commentFormSchema.safeParse(formValue);

  if (!commentForm.success) {
    fieldErrors.value = z.flattenError(commentForm.error).fieldErrors;
    return;
  }

  const commentResult = await commentStore.updateArticleComment({
    ...commentForm.data,
    comment_id: props.commentId,
  });

  if (!commentResult.success) {
    toastStore.showToast("error", commentResult.error.message);
    return;
  }
  toastStore.showToast("success", "Successfully update comment.");
  formElement.reset();
  emit("submitSuccess");
}
</script>
<template>
  <form ref="form-ref" class="flex flex-col gap-4" @submit.prevent="onSubmit">
    <Input
      as="textarea"
      name="content"
      placeholder="Input your comment.."
      rows="5"
      :value="content"
      :aria-invalid="!!fieldErrors?.content"
    />
    <ul>
      <li
        v-for="error in fieldErrors?.content || []"
        :key="error"
        class="text-destructive"
      >
        {{ error }}
      </li>
    </ul>
    <Button type="submit" class="w-full lg:ml-auto lg:w-fit">
      Update Comment
    </Button>
  </form>
</template>
