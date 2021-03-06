import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router/index'

import axios from 'axios'
import './assets/css/base.css'

axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
 //1、请求拦截
 axios.interceptors.request.use(config =>{
  // console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
},err=>{
  console.log(err)    
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
