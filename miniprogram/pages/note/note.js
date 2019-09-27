import Note from '../../models/note.js'
import Upload from '../../models/upload.js'
import common from '../../utils/common.js'
import util from '../../utils/util.js'

const noteModel = new Note()
const uploadModel = new Upload()

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

  customData: {
    type: 'add',
    id: ''
  },

  onLoad(option) {
    if (option && option.id) {
      Object.assign(this.customData, {
        type: 'edit',
        id: option.id
      })
      this.setData({
        readOnly: true
      })
    }
  },

  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(res => {
      that.editorCtx = res.context
    }).exec()
    this.customData.type === 'edit' && this.getNote(this.customData.id)
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
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        wx.showLoading({
          title: '插入中...',
        })
        that.doUpload(res)
      }
    })
  },

  // 上传图片
  doUpload(image) {
    const that = this
    // 选择图片
    const filePath = image.tempFilePaths[0]
    // 上传图片
    const randomStr = util.randomStr(8)
    const cloudPath = randomStr + filePath.match(/\.[^.]+?$/)[0]
    uploadModel.uploadFile({
      cloudPath,
      filePath
    }).then(res => {
      const { fileID } = res
      that.editorCtx.insertImage({
        src: fileID,
        data: {
          id: randomStr
        },
        success() {
          wx.hideLoading()
          common.showToast({ title: '插入成功' })
        },
        fail() {
          wx.hideLoading()
          common.showToast({ title: '插入失败' })
        }
      })
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

  onConfirmNote(form) {
    const that = this
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
        if (this.customData.type === 'add') {
          that.onSave(form)
        } else {
          that.onUpdate(form._id, form)
        }
      },
      fail(res) {
        console.log(res)
        common.showToast({ title: '保存失败' })
      }
    })
  },

  onSave(form) {
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

  onUpdate(id, form) {
    delete form._id
    noteModel.modifyNote(id, form, {
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

  handleModal(e) {
    console.log(e)
    const { opt, value } = e.detail
    if (opt === 'confirm') {
      this.onConfirmNote(value)
    } else {
      this.setData({
        showModal: false
      })
    }
  },

  getNote(id) {
    wx.showLoading({
      title: '加载中...'
    })
    noteModel.getNoteDetail(id).then(res => {
      this.setData({
        form: res.data
      })
      this.editorCtx.setContents({
        html: res.data.html,
        success() {
          wx.hideLoading()
          common.showToast({ title: '加载成功' })
        },
        fail() {
          wx.hideLoading()
          common.showToast({ title: '加载失败' })
        }
      })
    })
  },
})
