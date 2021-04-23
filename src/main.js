import Vue from 'vue'
import router from './router'
import App from './App.vue'
import { Icon, Button, Select, Input, Popover, Message } from 'element-ui'
Vue.config.productionTip = false
Message.install = function (Vue, options) {
  Vue.prototype.$message = Message
}
Vue.use(Input)
Vue.use(Icon)
Vue.use(Button)
Vue.use(Select)
Vue.use(Popover)
Vue.use(Message)
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
