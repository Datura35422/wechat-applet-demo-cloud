import Note from '../../models/note'

const noteModel = new Note()

Page({
  data: {
    note: noteModel
  },

  customData: {
    id: '',
    isLoad: false
  },

  onLoad(options) {
    console.log(options)
    const { id } = options
    this.customData.id = id
    this.getNote(id)
  },

  onShow() {
    if (!this.customData.isLoad) return
    this.customData.isLoad = true
    this.getNote(id)
  },

  onShareAppMessage() {

  },

  getNote(id) {
    wx.showNavigationBarLoading()
    noteModel.getNoteDetail(id, {
      complete: () => {
        wx.hideNavigationBarLoading()
      }
    }).then(res => {
      this.setData({
        note: res.data
      })
    })
  },

  onEdit() {
    wx.navigateTo({
      url: `/pages/note/note?id=${this.data.note._id}`,
    })
  }
})