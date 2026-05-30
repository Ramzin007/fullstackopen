import { useState } from 'react'

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')

  const addNote = event => {
    event.preventDefault()

    createNote({
      content: newNote,
      important: true
    })

    setNewNote('')
  }

  return (
    <form onSubmit={addNote}>
      <input
        value={newNote}
        onChange={({ target }) => setNewNote(target.value)}
        placeholder="write note content here"
      />
      <button type="submit">save</button>
    </form>
  )
}

export default NoteForm
