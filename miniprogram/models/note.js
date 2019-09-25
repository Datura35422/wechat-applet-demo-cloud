import Model from './model'
import util from '../utils/util'

const types = [
  { type: 1, typeName: '文字' },
  { type: 2, typeName: '文件' }
]

const categories = [
  { categorie: 1, categorieName: '工作' },
  { categorie: 2, categorieName: '学习' },
  { categorie: 3, categorieName: '读书' },
  { categorie: 4, categorieName: '社交' },
  { categorie: 5, categorieName: '其他' }
]

/**
 * Note 模型类
 */
class Note extends Model {
  constructor(model) {
    super()
    Object.assign(this, {
      type: types[0].type,
      categorie: categories[0].categorie,
      title: '',
      content: '',
      html: '',
      createdAt: util.formatDateTime(new Date())
    }, model)
  }

  getNoteList(query, data) {
    return this.callFunction(Object.assign({
      name: 'findList',
      data: {
        table: 'notes',
        ...query
      }
    }, data))
  }

  getNoteDetail(id, data = {}) {
    return this.callFunction(Object.assign({
      name: 'findOne',
      data: {
        table: 'notes',
        id: id
      }
    }, data))
  }

  postNote(form, data = {}) {
    return this.callFunction(Object.assign({
      name: 'addOne',
      data: {
        table: 'notes',
        data: form,
      }
    }, data))
  }

  modifyTodo(id, form, data = {}) {
    return this.callFunction(Object.assign({
      name: 'updateOne',
      data: {
        table: 'notes',
        id,
        data: form,
      }
    }, data))
  }

}

Note.categories = categories

export default Note
