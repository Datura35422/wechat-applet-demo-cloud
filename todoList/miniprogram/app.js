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
  }
})
