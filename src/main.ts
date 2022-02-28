import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

// Make BootstrapVue available throughout your project
// app.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
// app.use(IconsPlugin);

app.use(ElementPlus);
app.mount("#app");
