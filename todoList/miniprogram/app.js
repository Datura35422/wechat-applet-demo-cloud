import common from './utils/common.js'

App({
  onLaunch: function () {
    if (!wx.cloud) {
      common.showModal({
        title: '初始化失败',
        content: '请使用 2.2.3 或以上的基础库以使用云能力'
      })
    } else {
      wx.cloud.init({
        traceUser: true,
      })
      this.globalData.openid = common.getStoreSync('openid')
    }
  },

  globalData: {
    openid: '',
  },

  onGetOpenid(option) {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result)
        const { openid } = res.result
        this.globalData.openid = openid
        common.setStore('openid', openid)
        option && option.success && option.success()
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        option && option.fail && option.fail()
      }
    })
  },
})
