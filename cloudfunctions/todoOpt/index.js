const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const $ = db.command.aggregate
const _ = db.command
exports.main = async (event, context) => {
  const { opt } = event
  console.log(event)
  try {
    switch (opt) {
      case 'getMonthTodo':
        const { dateRange } = event
        return await db.collection('todos')
        .aggregate()
        .match(
          $.and([
            { beginDate: { $gte: dateRange.begin, $lte: dateRange.end } }
          ])
        )
        .group({
          _id: '$beginDate',
          num: $.sum(1)
        })
        .end()
      case 'getTodos':
        const { userInfo, filter, pager, order } = event
        const orderBy = order || { name: 'createAt', type: 'asc' }
        const page = pager && pager.page || 1
        const limit = pager && pager.limit || 20
        const skip = page && (page > 1 && (page - 1) * limit) || 0
        return await db.collection('todos')
          .where({
            _openid: userInfo.openId,
            period: filter.period,
            beginDate: _.gte(filter.begin).and(_.lte(filter.end))
          })
          .orderBy(orderBy.name, orderBy.type)
          .skip(skip) // 跳过结果集中的前 n 条，从第 n + 1 条开始返回
          .limit(limit) // 限制返回数量为 n 条
          .get()
      default:
        break
    }
  } catch (e) {
    console.error(e)
  }
}