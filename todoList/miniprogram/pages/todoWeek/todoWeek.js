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
    currentWeek: {},
    limit: 10,
    isLock: false,
    weeks: new Map()
  },

  onLoad() {
    const date = util.formatDateTime(new Date())
    this.setTitle(date)
    const currentDate = new Date()
    const sundayDate = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()))
    const saturdayDate = new Date(currentDate.setDate(currentDate.getDate() + (6 - currentDate.getDay())))
    this.onQuery(util.formatDateTime(sundayDate), util.formatDateTime(saturdayDate), 1)
    Object.assign(this.customData.currentWeek, { date })
  },

  onShow() {
    if (!this.customData.isLoad) {
      this.customData.isLoad = true
      return
    }
    const { begin, end, page } = this.customData.currentWeek
    this.onQuery(begin, end, page)
  },

  onReachBottom() {
    const { begin, end, page } = this.customData.currentWeek
    !this.data.isBottom && this.onQuery(begin, end, page + 1)
  },

  onQuery(begin, end, page) {
    if (this.customData.isLock) return
    wx.showNavigationBarLoading()
    this.customData.isLock = true
    todoModal.queryTodoList({
      filter: {
        period: 2,
        begin,
        end
      },
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
      console.log(res)
      const { data } = res
      const isBottom = data.length < this.customData.limit
      const todos = page === 1 ? data : Array.from(new Set(this.data.todos.concat(data))) // 去重
      this.setData({
        todos,
        isBottom
      })
      const week = { begin, end, page, isBottom, todos }
      this.customData.weeks.set(begin, week)
      Object.assign(this.customData.currentWeek, { begin, end, page, isBottom })
    })
  },

  onUpdate(e) {
    const { opt, id, date, begin } = e.detail
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
        const key = this.customData.currentWeek.begin
        const weekObj = this.customData.weeks.get(key)
        this.customData.weeks.set(key, Object.assign(weekObj, { todos: this.data.todos }))
        break
      case 'switch':
        Object.assign(this.customData.currentWeek, { date })
        if (this.customData.weeks.has(begin)) {
          const { begin, end, page, isBottom, todos } = this.customData.weeks.get(begin)
          this.setData({
            todos: begin === date ? todos : todos.filter(item => item.beginDate >= date),
            isBottom
          })
          Object.assign(this.customData.currentWeek, { begin, end, page, isBottom })
        } else {
          const beginDate = new Date(begin)
          const endDate = new Date(beginDate.setDate(beginDate.getDate() + 6))
          this.onQuery(begin, util.formatDateTime(endDate), 1)
        }
        this.setTitle(date)
        break
      default:
        break
    }
  },
  handleAddTodo() {
    wx.navigateTo({
      url: '/pages/todo/todo?period=2'
    })
  },
  setTitle(title) {
    wx.setNavigationBarTitle({
      title
    })
  }
})
