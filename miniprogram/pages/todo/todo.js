import Todo from '../../models/todo.js'
import common from '../../utils/common.js'

Page({

  data: {
    periods: Todo.periods,
    selectedPeriod: 0,
    levels: Todo.levels,
    selectedLevel: 0,
    categories: Todo.categories,
    selectedCategorie: 0,
    form: new Todo()
  },

  onLoad(option) {
    option && option.id && this.getOne(option.id)
  },

  onPickerChange(e) {
    console.log(e)
    const { type } = e.currentTarget.dataset
    const value = e.detail.value
    let form = {}
    switch (type) {
      case 'categorie': 
        this.setData({
          selectedCategorie: Number(value),
          form: Object.assign(this.data.form, {
            categorie: this.data.categories[Number(value)].categorie
          })
        })
        break
      case 'period':
        this.setData({
          selectedPeriod: Number(value),
          form: Object.assign(this.data.form, {
            period: this.data.periods[Number(value)].period
          })
        })
        break
      case 'level':
        this.setData({
          selectedLevel: Number(value),
          form: Object.assign(this.data.form, {
            level: this.data.levels[Number(value)].level
          })
        })
        break
      case 'beginDate':
        form.beginDate = value
        break
      case 'finishDate':
        form.finishDate = value
        break 
      case 'beignTime':
        form.finishDate = value
        break
      case 'finishTime':
        form.finishTime = value
        break
      default:
        break
    }
    Object.keys(form).length > 0 && this.setData({
      form: Object.assign(this.data.form, form)
    })
  },

  onInputContent(e) {
    const { value } = e.detail
    this.data.form.content = value
  },

  onSubmit() {
    if (!this.data.form.content) {
      wx.showToast({
        icon: 'none',
        title: '请填写完整'
      })
      return
    }
    this.onSave()
  },

  getOne(id) {
    wx.cloud.callFunction({
      name: 'findOne',
      data: {
        table: 'todos',
        id: id
      },
      success: res => {
        this.setData({
          form: res.result.data
        })
        console.log(res)
      },
      fail: err => {
        common.showToast({title: '获取数据失败'})
        console.error('[云函数] [findOne] 调用失败：', err)
      }
    })
  },

  onSave() {
    wx.cloud.callFunction({
      name: 'addOne',
      data: {
        table: 'todos',
        data: this.data.form,
      },
      success: res => {
        common.showToast({ title: '保存成功', icon: 'success' })
        console.log(res)
      },
      fail: err => {
        common.showToast({ title: '获取数据失败' })
        console.error('[云函数] [findOne] 调用失败：', err)
      }
    })
  }

})