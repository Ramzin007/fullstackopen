import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({ filter, onFilterChange }) => (
  <div>
    filter shown with{' '}
    <input value={filter} onChange={onFilterChange} />
  </div>
)

const PersonForm = ({
  onSubmit,
  newName,
  onNameChange,
  newNumber,
  onNumberChange
}) => (
  <form onSubmit={onSubmit}>
    <div>
      name:{' '}
      <input value={newName} onChange={onNameChange} />
    </div>
    <div>
      number:{' '}
      <input value={newNumber} onChange={onNumberChange} />
    </div>
    <button type="submit">add</button>
  </form>
)

const Persons = ({ persons }) => (
  <ul>
    {persons.map(person =>
      <li key={person.id}>
        {person.name} {person.number}
      </li>
    )}
  </ul>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const nameExists = persons.some(
      person => person.name === newName
    )

    if (nameExists) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter
        filter={filter}
        onFilterChange={(e) => setFilter(e.target.value)}
      />

      <h3>Add a new</h3>

      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        onNameChange={(e) => setNewName(e.target.value)}
        newNumber={newNumber}
        onNumberChange={(e) => setNewNumber(e.target.value)}
      />

      <h3>Numbers</h3>

      <Persons persons={personsToShow} />
    </div>
  )
}

export default App
