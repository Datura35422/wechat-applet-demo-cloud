import util from '../../utils/util.js'
import constants from '../../utils/constants.js'
import common from '../../utils/common.js'

const app = getApp()

let customData = {
  currentPage: 1,
  limit: 20
}

Page({
  data: {
    todos: [],
    tips: constants.todoListTips
  },

  onLoad(options) {
    console.log(util.stringToByte('a啊啊'))
    this.onQuery()
  },

  onShow() {

  },

  onPullDownRefresh() {

  },

  onReachBottom() {

  },

  onQuery(page) {
    console.log(app.globalData.openid)
    wx.cloud.callFunction({
      name: 'findList',
      data: {
        table: 'todos',
        fliter: {
          _openid: app.globalData.openid
        },
        pager: {
          page: page,
          limit: customData.limit
        }
      },
      success: res => {
        console.log(res)
        this.setData({
          todos: res.result.data
        })
      },
      fail: err => {
        common.showIcon({title: '获取数据失败'})
        console.error('[云函数] [findList] 调用失败：', err)
      }
    })
  },

  onUpdate() {

  },

  handleAddTodo() {
    wx.navigateTo({
      url: '/pages/todo/todo'
    })
  }
})