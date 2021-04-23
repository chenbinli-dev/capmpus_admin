/* 配置axios */
import axios from 'axios'
import Vue from 'vue'
//创建axios的实例
const adminRequest = axios.create({
    //后端接口
    baseURL: 'http://localhost:8888',
    //请求超时
    timeout: 5000
})
Vue.prototype.request = adminRequest
export default adminRequest