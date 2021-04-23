/* 配置项目的路由 */
import Vue from "vue"
import Router from 'vue-router'

//引入页面组件
const AdminLogin = () => import('views/login/Login')
const AdminHome = () => import('views/home/Home')
//安装路由
Vue.use(Router)
const routes = [
    {
        //启动后台默认进入登录页面
        path: '',
        redirect: '/admin/login'
    },
    {
        //管理员登录页面
        path: "/admin/login",
        component: AdminLogin
    },
    {
        //后台首页页面
        path: "/admin/home",
        component: AdminHome
    },
]
//创建路由实例
const router = new Router({
    routes,
    mode: "hash"
})
//设置路由跳转重复的处理
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
    return originalPush.call(this, location).catch(err => err)
}

export default router