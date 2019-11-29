import Todo from '../../models/todo.js'
import common from '../../utils/common.js'

const todoModel = new Todo()

Page({

  data: {
    periods: Todo.periods,
    selectedPeriod: 0,
    levels: Todo.levels,
    selectedLevel: 0,
    categories: Todo.categories,
    selectedCategorie: 0,
    form: todoModel,
    // finishDateStart: '',
    // beginDateStart: ''
  },

  customData: {
    type: 'add', // 初始化新增
    isLock: false
  },

  onLoad(option) {
    if (option) {
      option.id && this.getOne(option.id)
      option.period && this.setData({
        selectedPeriod: option.period - 1,
        [`form.period`]: Number(option.period)
      })
    }
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
      case 'beginTime':
        form.beginTime = value
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
    if (this.customData.isLock) return
    if (!this.data.form.content) {
      wx.showToast({
        icon: 'none',
        title: '请填写完整'
      })
      return
    }
    this.customData.type === 'add' ? this.onSave() : this.onModify()
  },

  getOne(id) {
    this.customData.isLock = true
    wx.showLoading({
      title: '加载中...',
    })
    todoModel.getTodoDetail(id, {
      complete: () => {
        wx.hideLoading()
      }
    }).then(res => {
      const data = res.data
      this.setData({
        selectedPeriod: data.period - 1,
        selectedLevel: data.level - 1,
        selectedCategorie: data.categorie - 1,
        form: data
      })
      Object.assign(this.customData, {
        type: 'edit',
        isLock: false
      })
    })
  },

  onSave() {
    wx.showLoading({
      title: '保存中...',
    })
    todoModel.postTodo(this.data.form, {
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

  onModify() {
    wx.showLoading({
      title: '保存中...',
    })
    const data = { ...this.data.form }
    delete data._id
    todoModel.modifyTodo(this.data.form._id, data, {
      complete: () => {
        wx.hideLoading()
      }
    }).then(res => {
      console.log(res.result)
      common.showToast({ title: '修改成功', icon: 'success' })
      const timer = setTimeout(() => {
        wx.navigateBack()
        clearTimeout(timer)
      }, 1000)
    })
  }
})