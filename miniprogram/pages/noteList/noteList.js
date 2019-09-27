import Note from '../../models/note.js'

const noteModel = new Note()
const app = getApp()

Page({
  data: {
    notes: [],
    delay: true, // 是否动画延迟
    options: {
      hiddenOptions: true,
      hiddenOption: ''
    },
    nextPages: [
      {
        key: 'upload',
        icon: '/assets/icons/edit.png',
        path: '/pages/note/note',
      }
    ]
  },

  customData: {
    isLoad: false,
    currentPage: 1,
    limit: 10,
    isLock: false
  },

  onLoad() {
    this.onQuery(1, {})
  },

  onShow() {
    if (!this.customData.isLoad) {
      this.customData.isLoad = true
      return
    }
    this.onQuery(this.customData.currentPage, {})
  },

  onReachBottom() {
    !this.data.isBottom && this.onQuery(this.customData.currentPage + 1, {})
  },

  onQuery(page, filter) {
    wx.showNavigationBarLoading()
    if (this.customData.isLock) return
    this.customData.isLock = true
    noteModel.getNoteList({
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
    }, {
      complete: () => {
        wx.hideNavigationBarLoading()
      }
    }).then(res => {
      console.log(res)
      const { data } = res
      this.setData({
        notes: page === 1 ? data : Array.from(new Set(this.data.notes.concat(data))), // 去重
        isBottom: data.length < this.customData.limit
      })
      Object.assign(this.customData, {
        currentPage: page,
        isLock: false
      })
    })
  },

  handleAddNote() {
    wx.navigateTo({
      url: '/pages/note/note'
    })
    // this.hiddenOption(false)
  },

  handleCancel() {
    this.hiddenOption(true, 'bounceOutDown')
  },

  toPage(e) {
    const _this = this
    const path = e.currentTarget.dataset.path
    wx.navigateTo({
      url: path,
      success() {
        _this.hiddenOption(true, 'bounceOutLeft')
      }
    })
  },

  hiddenOption(opt, animation) {
    if (opt) {
      this.setData({
        [`options.hiddenOption`]: animation
      }, () => {
        const optTimer = setTimeout(() => {
          this.setData({
            [`options.hiddenOptions`]: opt
          })
          clearTimeout(optTimer)
        }, 500)
      })
    } else {
      this.setData({
        options: {
          hiddenOptions: opt,
          hiddenOption: animation ? animation : ''
        }
      })
    }
  },
  onUpdate(e) {
    const { opt, id } = e.detail
    switch (opt) {
      case 'remove':
        this.setData({
          notes: this.data.notes.filter(item => item._id !== id)
        })
        break
      default:
        break
    }
  },
})