/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";
import App from "./App.vue";
import { createApp } from "vue";
import vuetify from "./plugins/vuetify"; // Vuetify 설정 파일

const app = createApp(App);

registerPlugins(app);
app.use(vuetify);
app.mount("#app");
