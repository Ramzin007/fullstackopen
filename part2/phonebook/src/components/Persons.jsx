const Persons = ({ persons, filter, deletePerson }) => {
  if (!Array.isArray(persons)) return null

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <ul>
      {personsToShow.map(person => (
        <li key={person.id}>
          {person.name} {person.number}{' '}
          <button onClick={() => deletePerson(person.id)}>
            delete
          </button>
        </li>
      ))}
    </ul>
  )
}

export default Persons
