<script setup lang="ts">
import Button from "@/components/Button.vue";
import Input from "@/components/Input.vue";
import { useToastStore } from "@/stores/toast";
import { ref, useTemplateRef } from "vue";
import z from "zod";
import { commentFormSchema, type CommentFormFieldErrors } from "../schemas";
import { useCreateComment } from "../composables/comment";

const props = defineProps({
  articleId: {
    type: String,
    default: "",
  },
});

const { mutateAsync: createComment } = useCreateComment();
const { showToast } = useToastStore();
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
    showToast("success", "Successfully create comment.");
    formElement.reset();
  } catch (error) {
    showToast("error", String(error));
  }
}
</script>
<template>
  <form ref="form-ref" class="flex flex-col gap-4" @submit.prevent="onSubmit">
    <Input
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
    <Button type="submit" class="w-full lg:ml-auto lg:w-fit">Comment</Button>
  </form>
</template>
