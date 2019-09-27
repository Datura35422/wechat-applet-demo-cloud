import Todo from '../../models/todo'
import util from '../../utils/util.js'
import common from '../../utils/common.js'

const todoModel = new Todo()

let customData = {
  isLock: false
}

Component({
  properties: {
    todo: {
      type: Todo,
      value: {}
    }
  },

  observers: {
    'todo': function(todo) {
      if (Object.keys(todo).length > 0) {
        this.setData({
          categorie: Todo.categories.filter(item => item.categorie === todo.categorie)[0].categorieName
        })
      }
    }
  },

  data: {
    categorie: Todo.categories[0].categorieName
  },

  methods: {
    onDetail() {
      wx.navigateTo({
        url: `/pages/todo/todo?id=${this.data.todo._id}`,
      })
    },
    onCheck() {
      if (this.data.todo.completed) return
      const currentDate = util.formatDateTime(new Date(), true)
      const data = {
        completed: true,
        completedAt: currentDate
      }
      todoModel.modifyTodo(this.data.todo._id, data, {}).then(res => {
        common.showToast({ title: '不错呦~', icon: 'success' })
        this.triggerEvent('update', { id: this.data.todo._id, opt: 'finished' })
      })
    },
    onRemove(e) {
      if (customData.isLock) return
      customData.isLock = true
      const _this = this
      const { _id } = this.data.todo
      common.showModal({
        title: '提示',
        content: '确认删除这条待办？',
        success: {
          confirm() {
            _this.onDelTodo(_id)
          }
        }
      })
    },
    onDelTodo(id) {
      todoModel.delTodo(id, {
        complete: () => {
          customData.isLock = false
        }
      }).then(res => {
        common.showToast({ title: '删除数据成功', icon: 'success' })
        this.triggerEvent('update', { id: this.data.todo._id, opt: 'remove' })
      })
    },
  }
})
