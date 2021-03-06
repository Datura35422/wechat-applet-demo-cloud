import util from '../../utils/util.js'
import constants from '../../utils/constants.js'
import common from '../../utils/common.js'
import Todo from '../../models/todo.js'

const app = getApp()
const todoModel = new Todo()

Page({
  data: {
    todos: [],
    tips: constants.todoListTips,
    isBottom: false,
    delay: true
  },

  customData: {
    isLoad: false,
    currentDay: {},
    limit: 10,
    isLock: false,
    days: new Map()
  },

  onLoad() {
    const date = util.formatDateTime(new Date())
    this.customData.currentDate = date
    this.setTitle(date)
    this.onQuery(1, {
      beginDate: date
    })
  },

  onShow() {
    if (!this.customData.isLoad) {
      this.customData.isLoad = true
      return
    }
    const { filter, page } = this.customData.currentDay
    this.onQuery(page, this.customData.currentDay.filter)
  },

  onReachBottom() {
    const { filter, page } = this.customData.currentDay
    !this.data.isBottom && this.onQuery(page + 1, fliter)
  },

  onQuery(page, filter) {
    wx.showNavigationBarLoading()
    if (this.customData.isLock) return
    this.customData.isLock = true
    const beginDate = filter.beginDate || util.formatDateTime(new Date())
    todoModel.getTodoList({
      filter: Object.assign({
        _openid: app.globalData.openid,
        period: 1,
      }, filter),
      pager: {
        page: page,
        limit: this.customData.limit
      },
      order: {
        name: 'beginTime',
        type: 'asc'
      }
    }, {
      complete: () => {
        this.customData.isLock = false
        wx.hideNavigationBarLoading()
      }
    }).then(res => {
      const { data } = res
      const todos = page === 1 ? data : Array.from(new Set(this.data.todos.concat(data))) // 去重
      const isBottom = data.length < this.customData.limit
      this.setData({ todos, isBottom })
      const days = { filter, page, isBottom, todos }
      this.customData.days.set(beginDate, days)
      Object.assign(this.customData.currentDay, { filter, page, isBottom })
    })
  },

  onDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/todo/todo?id=${id}`,
    })
  },

  onFinish(e) {
    if (this.customData.isLock) return
    this.customData.isLock = true
    const { id } = e.currentTarget.dataset
    const currentDate = util.formatDateTime(new Date(), true)
    const data = {
      completed: true,
      completedAt: currentDate
    }
    todoModel.modifyTodo(id, data, {
      complete: () => {
        this.customData.isLock = false
      }
    }).then(res => {
      common.showToast({ title: '不错呦~', icon: 'success' })
      this.data.todos.map(item => {
        if (item._id === id) {
          item.completed = true
        }
      })
      this.setData({
        todos: this.data.todos
      })
    })
  },

  onRemove(e) {
    if (this.customData.isLock) return
    this.customData.isLock = true
    const _this = this
    const { id } = e.currentTarget.dataset
    common.showModal({
      title: '提示',
      content: '确认删除这条待办？',
      success: {
        confirm() {
          _this.onDelTodo(id)
        },
        cancel() {
          _this.customData.isLock = false
        }
      }
    })
  },
  onDelTodo(id) {
    todoModel.delTodo(id, {
      complete: () => {
        this.customData.isLock = false
      }
    }).then(res => {
      common.showToast({ title: '删除数据成功', icon: 'success' })
      this.setData({
        todos: this.data.todos.filter(item => item._id !== id)
      })
    })
  },

  onUpdate(e) {
    const { opt, id } = e.detail
    switch (opt) {
      case 'switch':
        const date = e.detail.date
        if (this.customData.days.has(date)) {
          const { filter, page, isBottom, todos } = this.customData.days.get(date)
          this.setData({ todos, isBottom })
          Object.assign(this.customData.currentDay, { filter, page, isBottom })
        } else {
          this.onQuery(1, {
            beginDate: date
          })
        }
        this.setTitle(date)
        break
      default:
        break
    }
  },
  handleAddTodo() {
    wx.navigateTo({
      url: '/pages/todo/todo?period=1'
    })
  },
  setTitle(title) {
    wx.setNavigationBarTitle({
      title
    })
  }
})