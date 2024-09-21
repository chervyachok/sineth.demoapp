import './scss/app.scss'
import 'bootstrap';

// app
import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App);

// Pinia
import { createPinia } from 'pinia'
app.use(createPinia())

// mitt
import $mitt from '@/helpers/emitter';	
app.provide('$mitt', $mitt)
app.config.globalProperties.$mitt = $mitt;

import { useLoader } from "@/store/loader.store.js";
app.config.globalProperties.$loader = useLoader();
app.provide('$loader', useLoader())

import $swal from '@/helpers/swal'
app.config.globalProperties.$swal = $swal;
app.provide('$swal', $swal)

// globalFilters
import globalFilters from "./helpers/global.filters"
app.config.globalProperties.$filters = globalFilters
app.config.globalProperties.$location = window.location

// router
import router from "./router";
app.use(router)

// dayjs
import dayjs from "dayjs"; 
import relativeTime from "dayjs"; 
dayjs.locale('en')
dayjs.extend(relativeTime)
app.config.globalProperties.$date = dayjs
app.provide('$date', dayjs)

// web3Store
import { web3Store } from "@/store/web3.store.js";
app.config.globalProperties.$web3 = web3Store()
app.provide('$web3', web3Store())

app.mount('#app')