import Model from './model'
import util from '../utils/util'

const levels = [
  { level: 1, levelName: '紧急且重要' },
  { level: 2, levelName: '重要不紧急' },
  { level: 3, levelName: '紧急不重要' },
  { level: 4, levelName: '不紧急不重要' }
]

const periods = [
  { period: 1, periodName: '日计划' },
  { period: 2, periodName: '周计划' },
  { period: 3, periodName: '月计划' },
  { period: 4, periodName: '年计划' }
]

const categories = [
  { categorie: 1, categorieName: '工作' },
  { categorie: 2, categorieName: '学习' },
  { categorie: 3, categorieName: '读书' },
  { categorie: 4, categorieName: '社交' },
  { categorie: 5, categorieName: '其他' }
]

/**
 * Todo 模型类
 */
class Todo extends Model {
  constructor(model) {
    super()
    Object.assign(this, {
      categorie: categories[0].categorie,
      period: periods[0].period,
      level: levels[0].level,
      content: '',
      summury: '',
      beginDate: util.formatDateTime(new Date()),
      finishDate: util.formatDateTime(new Date()),
      beginTime: util.formatTime(new Date()),
      finishTime: util.formatTime(new Date()),
      completed: false,
      completedAt: 0,
      createdAt: new Date().getTime(),
      isContinuous: false // 默认todo为不持续的
    }, model)

    // 日期格式化
    // if (this.date.constructor === Date) {
    //   this.date = util.formatDateTime(this.date)
    // }
    // if (this.createdAt.constructor === Date) {
    //   this.createdAt = util.formatDateTime(this.createdAt)
    // }
    // if (this.completedAt.constructor === Date) {
    //   this.completedAt = util.formatDateTime(this.completedAt)
    // }
  }
}

Todo.levels = levels
Todo.periods = periods

Todo.categories = categories

export default Todo
