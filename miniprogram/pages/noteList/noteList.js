Page({

  data: {
    notes: [],
    delay: true // 是否动画延迟
  },
  onLoad(options) {

  },

  onReachBottom() {

  },

  handleAddNote() {
    wx.navigateTo({
      url: '/pages/note/note',
    })
  }
})