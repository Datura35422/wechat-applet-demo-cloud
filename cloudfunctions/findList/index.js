// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
let page = 1
let limit = 20
let skip = 0
exports.main = async (event, context) => {
  const { table, filter, pager } = event
  page = pager && pager.page || page
  skip = page && (page > 1 && (page - 1) * limit) || skip
  limit = pager && pager.limit || limit
  try {
    return await db.collection(table)
      .where(filter)
      .skip(skip) // 跳过结果集中的前 n 条，从第 n + 1 条开始返回
      .limit(limit) // 限制返回数量为 n 条
      .get()
  } catch (e) {
    console.error(e)
  }
}