import Note from '../../models/note.js'

Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    categorie: {
      type: Number,
      value: 1
    }
  },

  data: {
    form: {},
    categories: Note.categories,
    selectedCategorie: 0,
  },

  methods: {
    handleInput(e) {
      const value = e.detail.value
      this.data.form.title = value
    },
    handleCancel() {
      this.triggerEvent('modal', {
        opt: 'cancel'
      })
    },
    handleConfirm() {
      const form = Object.assign({
        title: this.data.title,
        categorie: this.data.categorie
      }, this.data.form)
      this.triggerEvent('modal', {
        opt: 'confirm',
        value: form
      })
    },
    onPickerChange(e) {
      const value = e.detail.value
      this.data.form.categorie = Number(value)
      this.setData({
        selectedCategorie: Number(value)
      })
    }
  }
})
