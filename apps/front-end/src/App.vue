<template>
  <h1 class="text-center">Hello App!</h1>
  <nav class="flex gap-4">
    <RouterLink to="/">Landing Page</RouterLink>
    <RouterLink to="/auth/login">Login Page</RouterLink>
    <RouterLink to="/auth/register">Register Page</RouterLink>
    <RouterLink to="/articles">Articles Page</RouterLink>
    <RouterLink to="/articles/1">Article Detail Page</RouterLink>
    <RouterLink to="/articles/1/comments/2"
      >Article Comment Detail Page</RouterLink
    >
  </nav>
  <main>
    <RouterView />
  </main>
</template>
