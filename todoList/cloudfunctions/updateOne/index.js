// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
exports.main = async (event, context) => {
  const { table, id, data } = event
  try {
    return await db.collection(table).doc(id).update({ data })
  } catch (e) {
    console.error(e)
  }
}