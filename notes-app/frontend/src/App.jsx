import { useState, useEffect } from 'react'
import noteService from './services/notes'
import loginService from './services/login'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
    return loggedUserJSON ? JSON.parse(loggedUserJSON) : null
  })

  const [message, setMessage] = useState(null)

  useEffect(() => {
    noteService.getAll().then(initialNotes => {
      setNotes(initialNotes)
    })
  }, [])

  useEffect(() => {
    if (user) {
      noteService.setToken(user.token)
    }
  }, [user])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password
      })

      window.localStorage.setItem(
        'loggedNoteAppUser',
        JSON.stringify(user)
      )

      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage('Login successful')
    } catch (error) {
      console.error(error)
      setMessage('Wrong username or password')
    }
  }

  const addNote = async event => {
    event.preventDefault()

    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5
    }

    const returnedNote = await noteService.create(noteObject)

    setNotes(notes.concat(returnedNote))
    setNewNote('')
  }

  const toggleImportanceOf = async id => {
    const note = notes.find(n => n.id === id)

    const changedNote = {
      ...note,
      important: !note.important
    }

    const returnedNote = await noteService.update(id, changedNote)

    setNotes(notes.map(note => note.id !== id ? note : returnedNote))
  }

  const logout = () => {
    window.localStorage.removeItem('loggedNoteAppUser')
    setUser(null)
    noteService.setToken(null)
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>

      <div>
        password
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>

      <button type="submit">login</button>
    </form>
  )

  const noteForm = () => (
    <form onSubmit={addNote}>
      <input
        value={newNote}
        onChange={({ target }) => setNewNote(target.value)}
      />
      <button type="submit">save</button>
    </form>
  )

  return (
    <div>
      <h1>Notes</h1>

      {message && <p>{message}</p>}

      {!user && loginForm()}

      {user && (
        <div>
          <p>
            {user.name} logged in
            <button onClick={logout}>logout</button>
          </p>

          {noteForm()}
        </div>
      )}

      <button onClick={() => setShowAll(!showAll)}>
        show {showAll ? 'important' : 'all'}
      </button>

      <ul>
        {notesToShow.map(note => (
          <li key={note.id}>
            {note.content}
            <button onClick={() => toggleImportanceOf(note.id)}>
              make {note.important ? 'not important' : 'important'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App