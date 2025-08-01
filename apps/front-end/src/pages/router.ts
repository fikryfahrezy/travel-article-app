import { useUserStore } from "@/features/auth/stores";
import AuthLayout from "@/layouts/AuthLayout.vue";
import {
  type RouteRecordRaw,
  createRouter,
  createWebHistory,
} from "vue-router";
import ArticleCommentDetailPage from "./ArticleCommentDetailPage.vue";
import ArticleDetailPage from "./ArticleDetailPage.vue";
import ArticlesPage from "./ArticlesPage.vue";
import LandingPage from "./LandingPage.vue";
import LoginPage from "./LoginPage.vue";
import RegisterPage from "./RegisterPage.vue";

export const routes: RouteRecordRaw[] = [
  {
    name: "Home",
    path: "/",
    component: LandingPage,
    meta: { navItem: true },
  },
  {
    path: "/articles",
    children: [
      {
        name: "Articles",
        path: "",
        component: ArticlesPage,
        meta: { navItem: true },
      },
      { path: ":articleId", component: ArticleDetailPage },
      {
        path: ":articleId/comments/:commentId",
        component: ArticleCommentDetailPage,
      },
    ],
  },
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      {
        name: "Login",
        path: "login",
        component: LoginPage,
        meta: { navItem: true, requiredAuth: false },
      },
      {
        name: "Register",
        path: "register",
        component: RegisterPage,
        meta: { navItem: true, requiredAuth: false },
      },
    ],
  },
];

export function getNavItemRoutes() {
  const navItems: RouteRecordRaw[] = [];
  const tmpRoutes = [...routes];

  while (tmpRoutes.length !== 0) {
    const tmpRoute = tmpRoutes.shift();

    if (!tmpRoute) {
      continue;
    }

    const childrenRoutes = tmpRoute?.children || [];
    for (const child of childrenRoutes) {
      const newChildPath = "/" + child.path;

      tmpRoutes.unshift({
        ...child,
        path: tmpRoute.path + (child.path ? newChildPath : ""),
      });
    }

    if (tmpRoute?.meta?.navItem === true) {
      navItems.push(tmpRoute);
    }
  }

  return navItems;
}

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkExactActiveClass: "text-primary",
});

router.beforeEach(async (to) => {
  const userStore = useUserStore();
  await userStore.getProfile();

  if (userStore.profile && to.meta.requiredAuth === false) {
    return { path: "/" };
  }
});

export default router;
