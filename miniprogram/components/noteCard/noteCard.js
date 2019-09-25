import Note from '../../models/note'

Component({
  properties: {
    note: {
      type: Note,
      value: new Note()
    }
  }
})
