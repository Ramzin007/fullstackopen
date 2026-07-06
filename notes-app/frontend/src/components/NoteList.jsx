const Note = ({ note, toggleImportance }) => {
  const label = note.important ? 'make not important' : 'make important'

  return (
    <li className="note">
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}

const NoteList = ({ notes, toggleImportance }) => {
  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => (
          <Note key={note.id} note={note} toggleImportance={() => toggleImportance(note.id)} />
        ))}
      </ul>
    </div>
  )
}

export default NoteList