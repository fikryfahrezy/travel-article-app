<script setup lang="ts">
import Button from "./Button.vue";
import ModalCard from "./ModalCard.vue";
import Overlay from "./Overlay.vue";
import XIcon from "./XIcon.vue";

defineEmits(["close"]);

defineProps({
  title: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <Overlay class="p-2">
    <ModalCard class="w-full max-w-2xl flex-col bg-white">
      <div class="flex w-full items-start justify-between">
        <p class="text-xl font-bold">{{ title }}</p>
        <Button background="text" variant="neutral" @click="$emit('close')">
          <XIcon />
        </Button>
      </div>
      <div class="w-full">
        <slot name="content" />
      </div>
      <div class="flex w-full justify-end gap-2">
        <slot name="cancel-button" />
        <slot name="confirm-button" />
      </div>
    </ModalCard>
  </Overlay>
</template>
