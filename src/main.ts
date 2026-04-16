import { createApp } from 'vue'
import 'open-props/open-props.min.css'
import router from './router'
import './style.css'
import App from './App.vue'

createApp(App).use(router).mount('#app')
