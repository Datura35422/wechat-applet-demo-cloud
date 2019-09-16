import Todo from '../../models/todo'
import util from '../../utils/util.js'
import common from '../../utils/common.js'

Component({
  properties: {
    index: {
      type: Number,
      value: 0
    },
    todo: {
      type: Todo,
      value: {}
    }
  },

  observers: {
    'todo': function(todo) {
      Object.keys(todo).length > 0 && this.setData({
        categorie: Todo.categories.fliter(item => item.id === todo.categorie)[0].categorieName
      })
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
      wx.cloud.callFunction({
        name: 'updateOne',
        data: {
          table: 'todos',
          id: this.data.todo._id,
          data,
        },
        success: res => {
          common.showToast({ title: '不错呦~', icon: 'success' })
          console.log(res)
          this.triggerEvent('update', { index: this.data.index })
        },
        fail: err => {
          common.showToast({ title: '更新数据失败' })
          console.error('[云函数] [updateOne] 调用失败：', err)
        }
      })
    }
  }
})
