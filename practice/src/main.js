import Vue from 'vue'
import App from './App.vue'

// router
import router from './router/index'
import 'babel-polyfill';
import Element from 'element-ui'
// import './styles/element-variables.scss'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css
Element.Dialog.props.closeOnClickModal.default = false
Element.Select.props.clearable = {
  type: Boolean,
  default: true
}
Element.Input.props.clearable.default = true
Vue.use(Element, {
  size: 'mini' // set element-ui default size
})
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
