// 云函数入口文件
// index.js 是入口文件，云函数被调用时会执行该文件导出的 main 方法

// 云函数入口函数
// event 包含了调用端（小程序端）调用该函数时传过来的参数，同时还包含了可以通过 getWXContext 方法获取的用户登录态 `openId` 和小程序 `appId` 信息
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  let { a, b } = event
  let sum = a + b

  return {
    sum
  }
}