import Note from '../../models/note.js'
import common from '../../utils/common.js'

const noteModel = new Note()

Page({
  data: {
    form: noteModel,
    formats: {},
    bottom: 0,
    readOnly: false,
    placeholder: '开始输入...',
    _focus: false,
    showModal: false
  },

  onLoad(option) {
    if (option) {
      // option.id && this.getOne(option.id)
    }
  },

  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },

  undo() { // 撤销
    this.editorCtx.undo()
  },

  redo() { // 恢复
    this.editorCtx.redo()
  },

  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    this.editorCtx.format(name, value)

  },

  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },

  insertDivider() {
    this.editorCtx.insertDivider({
      success() {
        console.log('insert divider success')
      }
    })
  },

  clear() {
    this.editorCtx.clear({
      success(res) {
        console.log("clear success")
      }
    })
  },

  removeFormat() {
    this.editorCtx.removeFormat()
  },

  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },

  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success() {
        that.editorCtx.insertImage({
          src: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543767268337&di=5a3bbfaeb30149b2afd33a3c7aaa4ead&imgtype=0&src=http%3A%2F%2Fimg02.tooopen.com%2Fimages%2F20151031%2Ftooopen_sy_147004931368.jpg',
          data: {
            id: 'abcd',
            role: 'god'
          },
          success: function () {
            console.log('insert image success')
          }
        })
      }
    })
  },

  readOnlyChange() {
    if (!this.data.readOnly) {
      this.setData({
        showModal: true
      })
    } else {
      this.setData({
        readOnly: !this.data.readOnly
      })
    }
  },

  onSaveNote(form) {
    const _this = this
    wx.showLoading({
      title: '保存中...',
    })
    this.editorCtx.getContents({
      success(res) {
        console.log(res)
        const { html, text } = res
        Object.assign(form, {
          html,
          content: text
        })
        noteModel.postNote(form, {
          complete: () => {
            wx.hideLoading()
          }
        }).then(res => {
          common.showToast({ title: '保存成功', icon: 'success' })
          const timer = setTimeout(() => {
            wx.navigateBack()
            clearTimeout(timer)
          }, 1000)
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  },

  handleModal(e) {
    console.log(e)
    const { opt, value } = e.detail
    if (opt === 'confirm') {
      this.onSaveNote(value)
    } else {
      this.setData({
        showModal: false
      })
    }
  }
})
