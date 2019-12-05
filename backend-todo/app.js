const logger = require('koa-logger')
const Koa = require('koa')
const parser = require('koa-bodyparser')

require('module-alias/register') // 路径别名

const InitManager = require('@core/init')
const catchError = require('@middlewares/exception') // 错误处理中间件

const app = new Koa() // 实例化， 应用程序对象：包含多种中间件

// app.use(logger()) // 日志
app.use(parser()) // 中间件，获取接口中的body传参
app.use(catchError)

// 启动koa框架，指定端口号
app.listen(3000)

// 初始化
InitManager.initCore(app)
