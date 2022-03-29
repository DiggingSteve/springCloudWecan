// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI, { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import signalr from 'signalr'
import vueScroll from './common/vue-scroll.esm'
import VueI18n from 'vue-i18n'
import store from "./store"
import com from './common/common'
import axios from './common/http'
import webpackConfig from '../config'
import components from './components/plugins/components'
import directive from './components/plugins/directive'
import "./assets/font/iconfont.css"
//import BaiduMap from 'vue-baidu-map'
// import wecancommontemplates from 'wecancommontemplates'//引入自定义的npm包，存放各项目公共模板
// Vue.use(wecancommontemplates)

// import wecanlogin from 'wecanlogin'//引入自定义的npm包，存放各项目公共模板
// Vue.use(wecanlogin)
// Vue.use(BaiduMap, {
//   ak: 'uRsmOKwXNAoVczCn5bH0kTD3W79kcftS'
// })
import * as filters from './filters'
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))

// 语言包
import {
  cn
} from './language/cn'
import {
  en
} from './language/en'

import Print from './components/plugins/print'
const errorHandler = (error, vm)=>{
  console.log(error)
    Message({
      type: 'error',
      message: error.message,
      duration: 1000
  })
  
  }

Vue.use(Print) // 注册
// 按键F2
Vue.config.keyCodes.f2 = 113

Vue.prototype.Global = com
Vue.prototype.$axios = axios

Vue.use(VueI18n)
Vue.use(ElementUI)
Vue.use(Vuex)
Vue.use(vueScroll)
// Vue.use(vueScroll, {
//   throttle: 1
// })
// Vue.use(vueScroll, {
//   debounce: 600
// })
Vue.use(components)
Vue.use(directive)
Vue.config.productionTip = false
Vue.config.performance = false
Vue.config.errorHandler = errorHandler;
// console.log(Vue.options.components)
//  console.log(Vue.prototype.$message)
var mymessage = Vue.prototype.$message //覆盖原来的方法，使可以手动关闭
var asignObj = {};
['success', 'warning', 'info', 'error'].forEach(i => {
  asignObj[i] = (options) => {
    if (typeof options == 'string') {
      mymessage({
        type: i,
        message: options,
        showClose: true
      })
    } else {
      options.type = options.type || i;
      mymessage(options)
    }

  }
})
Vue.prototype.$message = Object.assign(mymessage, asignObj)
// console.log(Vue.prototype)
Vue.options.components.ElDialog.mixin({
  watch: {
    visible(val) {
      // console.log(val)
      if (!val) $('.backtop').css('visibility', 'hidden')
    }
  },
  mounted() {
    $(this.$el).on('scroll', (event) => {
      if ($(event.target).attr('class').indexOf('dialogPage') >= 0) {
        // console.log($(event.target).scrollTop())
        if ($(event.target).scrollTop() > 20) {
          $(this.$el).find('.el-dialog__headerbtn:first').css({
            top: $(event.target).scrollTop() + 5 + 'px',
            right: '0px'
          })
          $('.backtop').css('right', '4px')
          $('.backtop').css('visibility', 'visible')
        } else {
          $(this.$el).find('.el-dialog__headerbtn:first').css({
            top: '10px',
            right: '20px'
          })

          $('.backtop').css('visibility', 'hidden')
        }
      }
    })
  },
  beforeDestroy() {
    $(this.$el).off('scroll')
  }
})





const i18n = new VueI18n({
  locale: 'Chinese', // 语言标识
  messages: {
    Chinese: cn,
    English: en
  }
})
//全局注入配置变量;注意login.vue和组件的data对象中取不到这些值，需要从store里面取;
Vue.mixin({
  data() {
    return {
      conditionalAreaForBuild: webpackConfig.build.conditionalAreaForBuild, //模板中判断地域
      projectIsWecan: webpackConfig.build.buildSystem == 'wecan', //是否用于唯凯系统，否则是恒丰
      logExtraDataForBuild: webpackConfig.build.logExtraDataForBuild, //接口的日志字段
    }
  }
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
