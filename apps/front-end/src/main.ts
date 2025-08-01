import { createPinia } from "pinia";
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import "./style.css";

import AuthLayout from "./layouts/AuthLayout.vue";

import ArticleCommentDetailPage from "./pages/ArticleCommentDetailPage.vue";
import ArticleDetailPage from "./pages/ArticleDetailPage.vue";
import ArticlesPage from "./pages/ArticlesPage.vue";
import LandingPage from "./pages/LandingPage.vue";
import LoginPage from "./pages/LoginPage.vue";
import RegisterPage from "./pages/RegisterPage.vue";

const routes = [
  { path: "/", component: LandingPage },
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      { path: "login", component: LoginPage },
      { path: "register", component: RegisterPage },
    ],
  },
  { path: "/articles", component: ArticlesPage },
  { path: "/articles/:articleId", component: ArticleDetailPage },
  {
    path: "/articles/:articleId/comments/:commentId",
    component: ArticleCommentDetailPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const pinia = createPinia();

createApp(App).use(pinia).use(router).mount("#app");
