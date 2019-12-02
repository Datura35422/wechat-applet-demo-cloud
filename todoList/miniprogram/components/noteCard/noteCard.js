import Note from '../../models/note'
import common from '../../utils/common.js'

const noteModel = new Note()

let customData = {
  isLock: false
}

Component({
  properties: {
    note: {
      type: Note,
      value: noteModel
    }
  },

  methods: {
    onDetail() {
      wx.navigateTo({
        url: `/pages/noteDetail/noteDetail?id=${this.data.note._id}`,
      })
    },
    onRemove(e) {
      if (customData.isLock) return
      customData.isLock = true
      const _this = this
      const { _id } = this.data.note
      common.showModal({
        title: '提示',
        content: '确认删除这条笔记？',
        success: {
          confirm() {
            _this.onDelTodo(_id)
          },
          cancel() {
            customData.isLock = false
          }
        }
      })
    },
    onDelTodo(id) {
      noteModel.delNote(id, {
        complete: () => {
          customData.isLock = false
        }
      }).then(res => {
        common.showToast({ title: '删除数据成功', icon: 'success' })
        this.triggerEvent('update', { id: this.data.note._id, opt: 'remove' })
      })
    },
  }
})
