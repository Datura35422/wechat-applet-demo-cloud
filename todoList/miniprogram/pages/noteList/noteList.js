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
        style: 'transform: scale(.5) translate3d(380rpx, 280rpx, 0);animation: showIn .3s ease-in forwards;'
      },
      {
        key: 'cancel',
        icon: '/assets/icons/cancel@gray.png',
        path: '/pages/note/note',
        style: 'transform: scale(.5) translate3d(-380rpx, 280rpx, 0);animation: showIn .3s ease-in forwards;'
      }
    ],
    isLogin: false,
    addBtn: {
      isAdd: false,
      btnAnimation: ''
    }
  },

  customData: {
    isLoad: false,
    currentPage: 1,
    limit: 10,
    isLock: false
  },

  onLoad() {
    if (app.globalData.openid !== '') {
      this.setData({
        isLogin: true
      })
      this.onQuery(1, {})
    }
  },

  onShow() {
    if (!this.customData.isLoad) {
      this.customData.isLoad = true
      return
    }
    this.onQuery(this.customData.currentPage, {})
    this.data.addBtn.btnAnimation && this.setData({
      addBtn: {
        isAdd: false,
        btnAnimation: ''
      }
    })
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
      }
    }, {
      complete: () => {
        wx.hideNavigationBarLoading()
      }
    }).then(res => {
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
    if (!this.data.addBtn.isAdd) {
      this.hiddenOption(false, { btnAnimation: `btn-animation` })
    } else {
      this.handleCancel()
    }
  },

  handleCancel() {
    this.hiddenOption(true, { optionAnimation: 'bounceOutDown', btnAnimation: 'btn-animation-out' })
  },

  toPage(e) {
    const _this = this
    const path = e.currentTarget.dataset.path
    const toPageAnimation = 'bounceOutLeft'
    wx.navigateTo({
      url: path,
      success() {
        _this.hiddenOption(true, { optionAnimation: toPageAnimation, btnAnimation: `ripple fast ${toPageAnimation}`})
      }
    })
  },

  hiddenOption(opt, { optionAnimation, btnAnimation }) {
    if (opt) {
      this.setData({
        [`options.hiddenOption`]: optionAnimation,
        addBtn: {
          isAdd: false,
          btnAnimation: btnAnimation
        }
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
          hiddenOption: optionAnimation ? optionAnimation : ''
        },
        addBtn: {
          isAdd: true,
          btnAnimation: btnAnimation
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
  updateLogin() {
    this.setData({
      isLogin: true
    })
  }
})