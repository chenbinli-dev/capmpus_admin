/* 配置项目的路由 */
import Vue from "vue"
import Router from 'vue-router'

//引入页面组件
const AdminLogin = () => import('views/login/Login')
const AdminHome = () => import('views/home/Home')
const System = () => import('views/home/System')
//用户管理
const UserInfo = () => import('views/user/UserInfo')
const UserBan = () => import('views/user/UserBan')
const Complain = () => import('views/user/Complain')
//任务管理
const TaskInfo = () => import('views/task/TaskInfo')
const TaskBlock = () => import('views/task/TaskBlock')
//用户余额
const UserBalance = () => import('views/balance/UserBalance')
//认证中心
const StudentVerify = () => import('views/verify/StudentVerify')
//数据可视化
const UserData = () => import('views/data/UserData')
const TaskData = () => import('views/data/TaskData')
const BalanceData = () => import('views/data/BalanceData')
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
        component: AdminHome,
        children: [
            {
                path:'',
                component:System
            },
            {
                //用户信息查看
                path: 'userInfo',
                component: UserInfo
            },
            {
                //用户账号禁用和解除
                path: 'userBan',
                component: UserBan
            },
            {
                //用户投诉处理
                path: 'complain',
                component: Complain
            },
            {
                //任务信息查看
                path: 'taskinfo',
                component: TaskInfo
            },
            {
                //任务锁定和解除
                path: 'taskBlock',
                component: TaskBlock
            },
            {
                //用户余额流水查看
                path: 'userBalance',
                component: UserBalance
            },
            {
                //学生认证中心
                path: 'student',
                component: StudentVerify
            },
            {
                //用户数据可视化
                path: 'userData',
                component: UserData
            },
            {
                //任务数据可视化
                path: 'taskData',
                component: TaskData
            },
            {
                //余额数据可视化
                path: 'balanceData',
                component: BalanceData
            },
        ]
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