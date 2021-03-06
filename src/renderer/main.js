import Vue from 'vue'

import 'bulma-fluent/css/bulma.css'

import './mixins'

import './assets/style/main.sass'
import './assets/style/animations.sass'
import './assets/fontawesome/css/fontawesome-all.css'

import App from './App'
import router from './router'
import store from './store'

const dataPaths = require('../utilities/data-paths.js')

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.config.productionTip = false
Vue.config.devtools = false

/* eslint-disable no-new */
const app = new Vue({
  components: {
    App
  },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

// eslint-disable-next-line
global.__paths = dataPaths()
