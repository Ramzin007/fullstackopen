import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '946565354' }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

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

  return (
    <div>
      <h2>Phonebook</h2>

      <form onSubmit={addPerson}>
        <div>
          name:{' '}
          <input
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
          />
        </div>

        <div>
          number:{' '}
          <input
            value={newNumber}
            onChange={(event) => setNewNumber(event.target.value)}
          />
        </div>

        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <div>debug: {newName} {newNumber}</div>

      <h2>Numbers</h2>

      <ul>
        {persons.map(person =>
          <li key={person.name}>
            {person.name} {person.number}
          </li>
        )}
      </ul>
    </div>
  )
}

export default App
