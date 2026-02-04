<script setup lang="ts">
import DOMPurify from "dompurify";
import { marked } from "marked";

defineProps({
  markdownTitle: {
    type: String,
    default: "",
  },
  markdownContent: {
    type: String,
    default: "",
  },
});

const renderer = new marked.Renderer();
renderer.heading = ({ text, depth }) => {
  const newLevel = Math.min(depth + 1, 6);
  return `<h${newLevel}>${text}</h${newLevel}>`;
};
</script>
<template>
  <div :class="['markdown-preview h-fit', $attrs.class]">
    <h1>{{ markdownTitle }}</h1>
    <!-- eslint-disable -- to suppress the warn for `v-html` -->
    <div
      v-html="
        DOMPurify.sanitize(
          marked.parse(markdownContent, { renderer, async: false }),
        )
      "
      class="h-full"
    ></div>
    <!-- eslint-enable -->
  </div>
</template>

<style>
@reference "tailwindcss";

.markdown-preview {
  /* Headings */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    @apply mt-6 mb-2 font-bold text-(--primary);
  }

  h1 {
    @apply pb-2 text-6xl;
  }

  h2 {
    @apply pb-2 text-3xl;
  }

  h3 {
    @apply pb-1 text-2xl;
  }

  h4 {
    @apply text-xl;
  }

  h5 {
    @apply text-lg;
  }

  /* Paragraphs */
  p {
    @apply my-4;
  }

  /* Links */
  a {
    @apply text-blue-600 underline transition-colors duration-200;
  }

  a:hover {
    @apply text-blue-800;
  }

  /* Lists */
  ul,
  ol {
    @apply my-4 pl-8;
  }

  ul {
    @apply list-disc;
  }

  ol {
    @apply list-decimal;
  }

  li {
    @apply my-1;
  }

  /* Blockquotes */
  blockquote {
    @apply my-4 border-l-4 border-neutral-300 pl-4 text-neutral-600 italic;
  }

  /* Code blocks (inline and multiline) */
  code,
  pre {
    @apply font-mono text-sm;
  }

  code {
    /* Inline code */
    @apply rounded-md px-1 py-0.5 text-(--primary);
  }

  pre {
    /* Multiline code block */
    @apply overflow-x-auto rounded-lg bg-neutral-900 p-4 text-white;
  }

  /* Images */
  img {
    @apply my-4 h-auto max-w-full rounded-lg shadow-md;
  }

  /* Tables */
  table {
    @apply my-4 w-full table-auto border-collapse;
  }

  th,
  td {
    @apply border border-gray-300 p-2 text-left;
  }

  th {
    @apply bg-gray-100 font-semibold;
  }

  tr:nth-child(even) {
    @apply bg-gray-50;
  }

  /* Horizontal Rule */
  hr {
    @apply my-8 border-t-2 border-neutral-200;
  }
}
</style>
