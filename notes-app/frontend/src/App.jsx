import { useState, useEffect, useRef } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm'
import Togglable from './components/Togglable'
import noteService from './services/notes'
import loginService from './services/login'

const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')

  const noteFormRef = useRef()

  useEffect(() => {
    noteService.getAll().then(initialNotes => {
      setNotes(initialNotes)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const showNotification = (text, type = 'success') => {
    setMessage(text)
    setMessageType(type)

    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleLogin = async credentials => {
    try {
      const user = await loginService.login(credentials)

      window.localStorage.setItem(
        'loggedNoteAppUser',
        JSON.stringify(user)
      )

      noteService.setToken(user.token)
      setUser(user)
      showNotification(`${user.name} logged in`)
    } catch (exception) {
      showNotification('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteAppUser')
    noteService.setToken(null)
    setUser(null)
  }

  const addNote = async noteObject => {
    noteFormRef.current.toggleVisibility()

    try {
      const returnedNote = await noteService.create(noteObject)
      setNotes(notes.concat(returnedNote))
      showNotification(`added '${returnedNote.content}'`)
    } catch (exception) {
      showNotification(
        exception.response?.data?.error || 'failed to add note',
        'error'
      )
    }
  }

  const toggleImportanceOf = async id => {
    const note = notes.find(n => n.id === id)

    const changedNote = {
      ...note,
      important: !note.important
    }

    try {
      const returnedNote = await noteService.update(id, changedNote)
      setNotes(notes.map(note => note.id !== id ? note : returnedNote))
    } catch (exception) {
      showNotification(
        `note '${note.content}' was already removed from server`,
        'error'
      )
      setNotes(notes.filter(n => n.id !== id))
    }
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes app</h1>

      <Notification message={message} type={messageType} />

      {!user && (
        <div>
          <h2>Login</h2>
          <LoginForm handleLogin={handleLogin} />
        </div>
      )}

      {user && (
        <div>
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </p>

          <Togglable buttonLabel="new note" ref={noteFormRef}>
            <NoteForm createNote={addNote} />
          </Togglable>
        </div>
      )}

      <button onClick={() => setShowAll(!showAll)}>
        show {showAll ? 'important' : 'all'}
      </button>

      <ul>
        {notesToShow.map(note => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>

      <footer className="footer">
        Note app, Department of Computer Science, University of Helsinki 2023
      </footer>
    </div>
  )
}

export default App