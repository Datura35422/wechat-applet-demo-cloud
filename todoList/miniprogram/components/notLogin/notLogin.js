import common from '../../utils/common.js'
const app = getApp()

Component({
  externalClasses: ['btn-class'],
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLogin() {
      const _this = this
      app.onGetOpenid({
        success() {
          _this.triggerEvent('update', true)
          common.showToast({
            title: '登录成功'
          })
        },
        fail() {
          common.showToast({
            title: '登录失败请重试'
          })
        }
      })
    }
  }
})
