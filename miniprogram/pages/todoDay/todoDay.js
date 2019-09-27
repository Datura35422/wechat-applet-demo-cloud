import util from '../../utils/util.js'
import constants from '../../utils/constants.js'
import common from '../../utils/common.js'
import Todo from '../../models/todo.js'

const app = getApp()
const todoModal = new Todo()

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
    todoModal.getTodoList({
      filter: Object.assign({
        _openid: app.globalData.openid,
        period: 1,
      }, filter),
      pager: {
        page: page,
        limit: this.customData.limit
      },
      order: {
        name: 'level',
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

  onUpdate(e) {
    const { opt, id } = e.detail
    switch (opt) {
      case 'finished':
        this.data.todos.map(item => {
          if (item._id === id) {
            item.completed = true
          }
        })
        this.setData({
          todos: this.data.todos
        })
        break
      case 'remove':
        this.setData({
          todos: this.data.todos.filter(item => item._id !== id)
        })
        const key = this.customData.currentDay.filter.beginDate
        const dayObj = this.customData.days.get(key)
        this.customData.days.set(key, Object.assign(dayObj, { todos: this.data.todos }))
        break
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