// 用来配置文件的别名，方便路径的寻找
const path = require('path')//引入path模块
function resolve (dir) {
    return path.resolve(__dirname, dir)//path.join(__dirname)设置绝对路径
}
module.exports = {
    publicPath: process.env.NODE_ENV === 'development' ? '/' : './',
    chainWebpack: (config) => {
        config.resolve.alias
            //set第一个参数：设置的别名，第二个参数：设置的路径
            .set('views', resolve('./src/views'))
            .set('assets', resolve('./src/assets'))
            .set('network', resolve('./src/network'))
            .set('router', resolve('./src/router'))
    }
}
