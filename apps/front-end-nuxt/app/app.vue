<template>
  <Suspense>
    <NuxtLayout>
      <NuxtPage />
      <template #fallback> Loading ... </template>
    </NuxtLayout>
  </Suspense>
</template>
