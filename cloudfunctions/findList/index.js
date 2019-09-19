// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
exports.main = async (event, context) => {
  const { table, filter, pager, order } = event
  const orderBy = order || { name: 'createAt', type: 'asc' }
  const page = pager && pager.page || 1
  const limit = pager && pager.limit || 20
  const skip = page && (page > 1 && (page - 1) * limit) || 0
  try {
    return await db.collection(table)
      .where(filter)
      .orderBy(orderBy.name, orderBy.type)
      .skip(skip) // 跳过结果集中的前 n 条，从第 n + 1 条开始返回
      .limit(limit) // 限制返回数量为 n 条
      .get()
  } catch (e) {
    console.error(e)
  }
}