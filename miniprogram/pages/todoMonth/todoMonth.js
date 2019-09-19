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
    currentPage: 1,
    limit: 10,
    isLock: false
  },
  
  onReachBottom() {

  },

  onShow() {
    // this.onQuery()
    const date = new Date()
    const beginDate = new Date(new Date().setDate(1))
    const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    this.onQuery(util.formatDateTime(beginDate), util.formatDateTime(endDate), 1)
  },

  onUpdate(e) {
    const { opt } = e.detail
    switch (opt) {
      case 'switch':
        const { date } = e.detail
        break
      default: 
        break
    }
  },

  onQuery(begin, end, page) {
    wx.showNavigationBarLoading()
    if (this.customData.isLock) return
    this.customData.isLock = true
    wx.cloud.callFunction({
      name: 'todoOpt',
      data: {
        opt: 'getMonthTodos',
        filter: {
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
      },
      success: res => {
        console.log(res)
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
})