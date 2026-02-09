const Countries = ({ countries, onShow }) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }

  if (countries.length > 1) {
    return (
      <ul>
        {countries.map(country => (
          <li key={country.cca3}>
            {country.name.common}
            <button onClick={() => onShow(country)}>
              show
            </button>
          </li>
        ))}
      </ul>
    )
  }

  return null
}

export default Countries
