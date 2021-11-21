import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './mock/mockServer';
import store from './store';

createApp(App).use(router).use(store).mount('#app');
