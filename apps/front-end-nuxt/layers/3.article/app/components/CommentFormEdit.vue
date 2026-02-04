<script setup lang="ts">
import MyButton from "#layers/my-base/app/components/MyButton.vue";
import MyInput from "#layers/my-base/app/components/MyInput.vue";
import { useToastStore } from "#layers/my-base/app/composables/toast";
import { ref, useTemplateRef } from "vue";
import z from "zod";
import { commentFormSchema, type CommentFormFieldErrors } from "#layers/my-article/app/schemas/comment.schema";
import { useUpdateComment } from "#layers/my-article/app/composables/comment";

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

const { mutateAsync: updateComment } = useUpdateComment();
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

  try {
    await updateComment({
      ...commentForm.data,
      comment_id: props.commentId,
    });

    toastStore.showToast("success", "Successfully update comment.");
    formElement.reset();
  } catch (error) {
    toastStore.showToast("error", String(error));
    return;
  }
}
</script>
<template>
  <form ref="form-ref" class="flex flex-col gap-4" @submit.prevent="onSubmit">
    <MyInput
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
    <MyButton type="submit" class="w-full lg:ml-auto lg:w-fit">
      Update Comment
    </MyButton>
  </form>
</template>
