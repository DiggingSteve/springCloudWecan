import Vue from 'vue'
import Router from 'vue-router'
import index from '@/index.vue'
import login from '@/login'

Vue.use(Router)

//解决vue项目路由出现message: "Navigating to current location (XXX) is not allowed"的问题
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  let rou = routerPush.call(this, location)
  if (rou) {
    return rou.catch(error => error)
  }
}
export default new Router({
  routes: [
    {
      path: '/',
      redirect: "login",
      component: login
    },
    // {
    // path: '/',
    //   redirect: "index",
    //   component: index
    // },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/index',
      name: 'index',
      component: index
    },
    {
      path: '*',
      name: 'login',
      component: login
    }
  ],
  scrollBehavior(to, from, savedPosition) {
            if ($('.dialogPage:visible').length >= 1) {
              let top = $('.dialogPage:visible').find('.el-dialog__header:visible:first').find('.el-dialog__headerbtn:visible:first').css('top').replace('px', '')
                $(".dialogPage:visible").scrollTop(Number(top))
            }
  },
  //mode: 'history',
  //base: process.env.ROUTER_BASE, // 这是新加的配置
})
