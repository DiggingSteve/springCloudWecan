/*
 * @Description: 
 * @Version: 
 * @Autor: ZX
 * @Date: 2021-06-25 14:27:56
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-11-03 10:07:59
 */
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router/'
import Vuex from 'vuex'
import signalr from 'signalr'
import vueScroll from './common/vue-scroll.esm'
import VueI18n from 'vue-i18n'
import store from "./store"
import com from './common/common.js'
import axios from './common/http.js'
import webpackConfig from '../config'
import components from './components/plugins/components'
import directive from './components/plugins/directive'
import websoketGlobal from './utils/websoket'
import "./assets/font/iconfont.css"
import drag from '@/utils/drag';
import * as filters from './filters/index' //import * as obj from "xxx" 会将 "xxx" 中所有 export 导出的内容组合成一个对象返回

Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))

// 语言包
import {
  cn
} from './language/cn.js'
import {
  en
} from './language/en.js'

// 按键F2
Vue.config.keyCodes.f2 = 113

Vue.prototype.Global = com;
Vue.prototype.$axios = axios;
Vue.prototype.$websoketGlobal = websoketGlobal

Vue.use(VueI18n);
Vue.use(ElementUI)
Vue.use(Vuex)
Vue.use(vueScroll)
Vue.use(components)
Vue.use(directive)
Vue.use(drag)
Vue.config.productionTip = false
Vue.config.performance = false




const i18n = new VueI18n({
  locale: 'Chinese', // 语言标识
  messages: {
    Chinese: cn,
    English: en
  }
})

Vue.mixin({
  data() {
    return {
      conditionalAreaForBuild: webpackConfig.build.conditionalAreaForBuild, //模板中判断地域
      projectIsWecan: webpackConfig.build.buildSystem == 'wecan', //是否用于唯凯系统，否则是恒丰
      logExtraDataForBuild: webpackConfig.build.logExtraDataForBuild, //接口的日志字段
    }
  }
})


router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    let href = window.location.href
    let index = href.indexOf('/wffmanagement.html')
    let newHref = href.replace(href.substr(index), '')
    window.location.href = newHref
  }
  next()
})

new Vue({
  el: '#app',
  i18n,
  signalr,
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
