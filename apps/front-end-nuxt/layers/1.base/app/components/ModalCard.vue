<template>
  <div
    :class="[
      'flex items-center justify-between gap-4 px-4 py-2 shadow-[5px_5px_black]',
      $attrs.class,
    ]"
  >
    <slot />
  </div>
</template>
