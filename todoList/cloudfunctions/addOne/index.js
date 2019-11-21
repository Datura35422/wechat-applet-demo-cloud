// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
exports.main = async (event, context) => {
  const { table, data, userInfo } = event
  try {
    return await db.collection(table).add({
      data: Object.assign({ ...data }, { _openid: userInfo.openId })
    })
  } catch (e) {
    console.error(e)
  }
}