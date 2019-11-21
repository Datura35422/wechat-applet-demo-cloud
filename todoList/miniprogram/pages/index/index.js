import common from '../../utils/common.js'

const app = getApp()

let customData = {
  // logged: false
}

Page({
  data: {
    openid: app.globalData.openid
  },

  onLoad() {
    if (!wx.cloud) {
      common.showModal({
        title: '初始化失败',
        content: '请使用 2.2.3 或以上的基础库以使用云能力'
      })
    }
  },

  onGetOpenid() {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result)
        const { openid } = res.result
        app.globalData.openid = openid
        this.setData({
          openid: openid
        })
        common.setStore('openid', openid)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

})
