import { useEffect, useState } from 'react'
import countryService from './services/countries'
import Countries from './components/countries'
import Country from './components/country'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [manualCountry, setManualCountry] = useState(null)

  useEffect(() => {
    countryService.getAll().then(response => {
      setCountries(response.data)
    })
  }, [])

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  // 🔥 derived, NOT state
  const selectedCountry =
    filteredCountries.length === 1
      ? filteredCountries[0]
      : manualCountry

  const handleShow = (country) => {
    setManualCountry(country)
  }

  return (
    <div>
      find countries{' '}
      <input
        value={filter}
        onChange={e => {
          setFilter(e.target.value)
          setManualCountry(null) // reset manual selection
        }}
      />

      <Countries
        countries={filteredCountries}
        onShow={handleShow}
      />

      <Country country={selectedCountry} />
    </div>
  )
}

export default App
