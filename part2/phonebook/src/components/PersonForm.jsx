const PersonForm = ({
  addPerson,
  newName,
  newNumber,
  setNewName,
  setNewNumber
}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name:{' '}
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
      </div>
      <div>
        number:{' '}
        <input
          value={newNumber}
          onChange={(e) => setNewNumber(e.target.value)}
        />
      </div>
      <button type="submit">add</button>
    </form>
  )
}

export default PersonForm
