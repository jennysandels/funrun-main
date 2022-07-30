import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import store from "./store";
import config from './config.js'

loadFonts()

createApp(App)
    .use(router)
    .use(vuetify)
    .use(store)
    .use(config)
    .mount('#app')