import util from '../../utils/util.js'
import constants from '../../utils/constants.js'
import common from '../../utils/common.js'

const app = getApp()

Page({
  data: {
    todos: [],
    tips: constants.todoListTips,
    isBottom: false,
    delay: true
  },

  customData: {
    isLoad: false,
    currentDate: null,
    currentPage: 1,
    limit: 10,
    isLock: false
  },

  onLoad() {
    const date = util.formatDateTime(new Date())
    this.customData.currentDate = date
    this.setTitle(date)
    this.onQuery(1, {
      period: 1, // 日计划
      beginDate: date
    })
  },

  onShow() {
    if (!this.customData.isLoad) {
      this.customData.isLoad = true
      return
    }
    this.onQuery(1, {
      beginDate: this.customData.currentDate
    })
  },

  onReachBottom() {
    !this.data.isBottom && this.onQuery(this.customData.currentPage + 1)
  },

  onQuery(page, filter) {
    wx.showNavigationBarLoading()
    if (this.customData.isLock) return
    this.customData.isLock = true
    wx.cloud.callFunction({
      name: 'findList',
      data: {
        table: 'todos',
        filter: Object.assign({
          _openid: app.globalData.openid
        }, filter),
        pager: {
          page: page,
          limit: this.customData.limit
        },
        order: {
          name: 'level',
          type: 'asc'
        }
      },
      success: res => {
        const { data } = res.result
        this.setData({
          todos: page === 1 ? data : this.data.todos.concat(data),
          isBottom: data.length < this.customData.limit
        })
        Object.assign(this.customData, {
          currentPage: page,
          isLock: false
        })
      },
      fail: err => {
        common.showToast({ title: '获取数据失败' })
        console.error('[云函数] [findList] 调用失败：', err)
      },
      complete: () => {
        wx.hideNavigationBarLoading()
      }
    })
  },

  onUpdate(e) {
    const opt = e.detail.opt
    switch (opt) {
      case 'finished':
        const id = e.detail.id
        this.data.todos.map(item => {
          if (item._id === id) {
            item.completed = true
          }
        })
        this.setData({
          todos: this.data.todos
        })
        break
      case 'switch':
        const date = e.detail.date
        this.onQuery(1, {
          beginDate: date
        })
        this.setTitle(date)
        break
      default:
        break
    }
  },

  handleAddTodo() {
    wx.navigateTo({
      url: '/pages/todo/todo'
    })
  },

  onRemove(e) {
    if (this.customData.isLock) return
    const _this = this
    const { id } = e.currentTarget.dataset
    common.showModal({
      title: '提示',
      content: '确认删除这条消息？',
      success: {
        confirm() {
          _this.onDelTodo(id)
        }
      }
    })
  },
  onDelTodo(id) {
    wx.cloud.callFunction({
      name: 'delOne',
      data: {
        table: 'todos',
        id
      },
      success: res => {
        common.showToast({ title: '删除数据成功', icon: 'success' })
        this.setData({
          todos: this.data.todos.filter(item => item._id !== id)
        })
        this.customData.isLock = false
      },
      fail: err => {
        common.showToast({ title: '删除数据失败' })
        console.error('[云函数] [delOne] 调用失败：', err)
      }
    })
  },
  setTitle(title) {
    wx.setNavigationBarTitle({
      title
    })
  }
})