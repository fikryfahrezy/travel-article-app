import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./pages/router";
import "./style.css";

import { VueQueryPlugin } from "@tanstack/vue-query";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(VueQueryPlugin);
app.mount("#app");
