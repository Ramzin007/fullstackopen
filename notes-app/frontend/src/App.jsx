import { useState, useEffect } from 'react'
import noteService from './services/notes'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'
import NoteList from './components/NoteList'
import Home from './components/Home'
import Footer from './components/Footer'
import NoteForm from './components/NoteForm'

const App = () => {
  const [notes, setNotes] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    noteService.getAll().then(initialNotes => {
      setNotes(initialNotes)
    }).catch(error => {
      console.error('Error fetching notes:', error)
      setErrorMessage('Failed to fetch notes')
    })
  }, [])

  const addNote = noteObject => {
    noteService.create(noteObject).then(returnedNote => {
      setNotes(notes.concat(returnedNote))
    })
  }

  const toggleImportance = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService.update(id, changedNote).then(returnedNote => {
      setNotes(notes.map(n => n.id !== id ? n : returnedNote))
    })
  }

  const padding = {
    padding: 5
  }

  return (

    <Router>
      <div>
        <Link style={padding} to="/">home</Link>
        <Link style={padding} to="/notes">notes</Link>
        <Link style={padding} to="/create">new note</Link>
      </div>

      {errorMessage && <div className="error">{errorMessage}</div>}

      <Routes>
        <Route path="/notes" element={
          <NoteList notes={notes} toggleImportance={toggleImportance} />
        } />
        <Route path="/create" element={
          <NoteForm createNote={addNote}/>
        } />
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App