<script setup lang="ts">
import MyButton from "@/components/MyButton.vue";
import MyInput from "@/components/MyInput.vue";
import { useToastStore } from "~/composables/toast";
import { ref, useTemplateRef } from "vue";
import z from "zod";
import { commentFormSchema, type CommentFormFieldErrors } from "@/schemas/comment.schema";
import { useCreateComment } from "@/composables/comment";

const props = defineProps({
  articleId: {
    type: String,
    default: "",
  },
});

const { mutateAsync: createComment } = useCreateComment();
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
    await createComment({
      ...commentForm.data,
      article_id: props.articleId,
    });
    toastStore.showToast("success", "Successfully create comment.");
    formElement.reset();
  } catch (error) {
    toastStore.showToast("error", String(error));
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
    <MyButton type="submit" class="w-full lg:ml-auto lg:w-fit">Comment</MyButton>
  </form>
</template>
