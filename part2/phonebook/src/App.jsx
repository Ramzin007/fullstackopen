import { useState, useEffect } from 'react'
import personService from './services/persons'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService.getAll().then(response => {
      setPersons(response.data)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(p => p.name === newName)

    if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already added. Replace the old number?`
        )
      ) {
        const updatedPerson = {
          ...existingPerson,
          number: newNumber
        }

        personService
          .update(existingPerson.id, updatedPerson)
          .then(response => {
            setPersons(
              persons.map(p =>
                p.id !== existingPerson.id ? p : response.data
              )
            )

            setNotification(`Updated ${response.data.name}`)
            setTimeout(() => setNotification(null), 3000)
          })
      }
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService.create(personObject).then(response => {
      setPersons(persons.concat(response.data))

      setNotification(`Added ${response.data.name}`)
      setTimeout(() => setNotification(null), 3000)

      setNewName('')
      setNewNumber('')
    })
  }

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)

    if (window.confirm(`Delete ${person.name}?`)) {
      personService.remove(id).then(() => {
        setPersons(persons.filter(p => p.id !== id))

        setNotification(`Deleted ${person.name}`)
        setTimeout(() => setNotification(null), 3000)
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notification} />

      <Filter filter={filter} setFilter={setFilter} />

      <h3>Add a new</h3>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
      />

      <h3>Numbers</h3>

      <Persons
        persons={persons}
        filter={filter}
        deletePerson={deletePerson}
      />
    </div>
  )
}

export default App
