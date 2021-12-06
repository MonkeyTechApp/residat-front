import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueGtag from 'vue-gtag'

import VueApexCharts from 'vue-apexcharts'
import InlineSvg from 'vue-inline-svg'

Vue.use(VueApexCharts)
Vue.use(VueGtag, {
  config: {
    id: 'G-NSDTBQ55CJ',
    params: {
      send_page_view: false
    }
  }
})

Vue.component('apexchart', VueApexCharts)
Vue.component('inline-svg', InlineSvg)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
