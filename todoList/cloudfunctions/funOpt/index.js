const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  const { opt } = event
  try {
    switch (opt) {
      case 'randomOne':
        return await db.collection('fun')
          .aggregate()
          .sample({
            size: 1
          })
          .end()
      case 'hitOne':
        const { id } = event
        return await db.collection('fun')
          .doc(id)
          .update({
            data: {
              hits: _.inc(1)
            }
          })
      default: break 
    }
  } catch (e) {
    console.error(e)
  }
}