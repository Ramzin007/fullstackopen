const Persons = ({ persons, onRemove }) =>
  persons.map((person) => (
    <p key={person.name}>
      {person.name} {person.number}{' '}
      <button onClick={() => onRemove(person)}>delete</button>
    </p>
  ))

export default Persons