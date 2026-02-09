import Weather from './weather'

const Country = ({ country }) => {
  if (!country) return null

  return (
    <div>
      <h2>{country.name.common}</h2>

      <div>capital {country.capital[0]}</div>
      <div>area {country.area}</div>

      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img
        src={country.flags.png}
        alt={country.flags.alt}
        width="150"
      />

      <Weather capital={country.capital[0]} />
    </div>
  )
}

export default Country
