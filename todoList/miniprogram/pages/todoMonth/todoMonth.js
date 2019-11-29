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
    currentDate: {},
    limit: 10,
    isLock: false,
    months: new Map(), // 保存index
    monthTodos: []
  },
  
  onReachBottom() {
    const month = this.customData.currentDate
    !this.data.isBottom && this.onQuery(month.key, month.begin, month.end, month.page + 1)
  },

  onLoad() {
    this.getCurrentMonth()
  },

  onShow() {
    if (!this.customData.isLoad) {
      this.customData.isLoad = true
      return
    }
    const monthsIndex = this.customData.months.get(this.customData.currentDate.key)
    const month = this.customData.monthTodos[monthsIndex]
    this.onQuery(month.key, month.begin, month.end, month.page)
  },

  getCurrentMonth() {
    const date = new Date()
    const key = `${date.getFullYear()}-${util.formatNumber(date.getMonth() + 1)}`
    const begin = util.formatDateTime(new Date(new Date().setDate(1)))
    const end = util.formatDateTime(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0))
    Object.assign(this.customData.currentDate, {
      key,
      begin,
      end,
      page: 1
    })
    this.onQuery(key, begin, end, 1)
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
        break
      case 'switch':
        const { date } = e.detail
        const dateArr = date.split('-')
        const begin = util.formatDateTime(new Date(Number(dateArr[0]), Number(dateArr[1]) - 1, 1))
        const end = util.formatDateTime(new Date(Number(dateArr[0]), Number(dateArr[1]), 0))
        const months = this.customData.months
        let page = 1
        if (months.has(date)) {
          let monthTodos = this.customData.monthTodos
          const monthsIndex = months.get(date)
          this.setData({
            todos: monthTodos[monthsIndex].todos,
            isBottom: monthTodos[monthsIndex].isBottom
          })
          page = monthTodos[monthsIndex].page
        } else {
          this.onQuery(date, begin, end, 1)
        }
        Object.assign(this.customData.currentDate, {
          key: date,
          begin,
          end,
          page
        })
        break
      default: 
        break
    }
  },

  onQuery(key, begin, end, page) {
    wx.showNavigationBarLoading()
    if (this.customData.isLock) return
    this.customData.isLock = true
    todoModal.queryTodoList({
      filter: {
        period: 3,
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
        wx.hideNavigationBarLoading()
      }
    }).then(res => {
      const { data } = res
      const isBottom = data.length < this.customData.limit
      const todos = page === 1 ? data : Array.from(new Set(this.data.todos.concat(data))) // 去重
      this.setData({
        todos,
        isBottom
      })
      let monthTodos = this.customData.monthTodos
      let months = this.customData.months
      if (!months.has(key)) {
        monthTodos.push({
          key,
          begin,
          end,
          page,
          todos,
          isBottom
        })
        months.set(key, monthTodos.length - 1)
      } else if (!monthTodos[months.get(key)]) {
        monthTodos[months.get(key)] = {
          key,
          begin,
          end,
          page,
          todos,
          isBottom
        }
      } else {
        const monthsIndex = months.get(key)
        Object.assign(monthTodos[monthsIndex], {
          page,
          todos,
          isBottom
        })
      }
      Object.assign(this.customData, {
        currentDate: {
          key,
          begin,
          end,
          page
        },
        isLock: false,
        monthTodos,
        months
      })
    })
  },
  handleAddTodo() {
    wx.navigateTo({
      url: '/pages/todo/todo?period=3'
    })
  }
})