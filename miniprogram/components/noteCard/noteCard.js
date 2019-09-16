import Note from '../../models/note'

Component({
  properties: {
    note: {
      type: Note,
      default: new Note()
    }
  }
})
