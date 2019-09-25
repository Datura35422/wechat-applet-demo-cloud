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
  constructor() {
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
    })
  }

  getTodoDetail(id, data = {}) {
    return this.callFunction(Object.assign({
      name: 'findOne',
      data: {
        table: 'todos',
        id: id
      }
    }, data))
  }

  postTodo(form, data = {}) {
    return this.callFunction(Object.assign({
      name: 'addOne',
      data: {
        table: 'todos',
        data: form,
      }
    }, data))
  }

  modifyTodo(id, form, data = {}) {
    return this.callFunction(Object.assign({
      name: 'updateOne',
      data: {
        table: 'todos',
        id,
        data: form,
      }
    }, data))
  }

  getTodoList(query, data) {
    return this.callFunction(Object.assign({
      name: 'findList',
      data: {
        table: 'todos',
        ...query
      }
    }, data))
  }

  queryTodoList(query, data) {
    return this.callFunction(Object.assign({
      name: 'todoOpt',
      data: {
        opt: 'getTodos',
        ...query
      },
    }, data))
  }

  getMonthTodo(query, data) {
    return this.callFunction(Object.assign({
      name: 'todoOpt',
      data: {
        opt: 'getMonthTodo',
        ...query
      },
    }, data))
  }
}

Todo.levels = levels
Todo.periods = periods

Todo.categories = categories

export default Todo
