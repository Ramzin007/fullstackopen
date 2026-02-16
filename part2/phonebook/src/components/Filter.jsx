const Filter = ({ filter, setFilter }) => (
  <div>
    filter shown with{' '}
    <input value={filter} onChange={(event) => setFilter(event.target.value)} />
  </div>
)

export default Filter