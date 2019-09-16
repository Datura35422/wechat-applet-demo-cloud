import Model from './model'
import util from '../utils/util'

/**
 * Note 模型类
 */
class Note extends Model {
  constructor(model) {
    super()
    Object.assign(this, {
      title: '',
      content: '',
      createdAt: util.formatDateTime(new Date()),
      planId: null,
      targetId: null,
    }, model)

    // 日期格式化
    if (this.createdAt.constructor === Date) {
      this.createdAt = util.formatDateTime(this.createdAt)
    }
  }
}

export default Note
