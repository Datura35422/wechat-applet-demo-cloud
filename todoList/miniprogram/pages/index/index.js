import common from '../../utils/common.js'

const app = getApp()

let customData = {
  // logged: false
}

Page({
  data: {
    openid: app.globalData.openid,
    animation: {}
  },

  customData: {
    timer: null
  },

  onLoad() {
    const animation = {
      two: 'fadeInRight',
      three: 'fadeInUp',
      four: 'fadeInRight'
    }
    this.setData({
      ['animation.one']: 'fadeInDown'
    })
    let num = 0
    for (let key in animation) {
      num++
      this.timeoutAnimation(key, animation[key], num)
    }
  },

  timeoutAnimation(key, animation, num) {
    this.customData.timer = setTimeout(() => {
      this.setData({
        [`animation.${key}`]: animation
      })
      num > 2 && clearTimeout(this.customData.timer)
    }, 1000 * num)
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
