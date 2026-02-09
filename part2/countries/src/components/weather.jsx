import { useEffect, useState } from 'react'
import weatherService from '../services/weather'

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    weatherService
      .getWeather(capital)
      .then(response => {
        setWeather(response.data)
      })
  }, [capital])

  if (!weather) return null

  const iconUrl =
    `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <div>temperature {weather.main.temp} °C</div>
      <img src={iconUrl} alt="weather icon" />
      <div>wind {weather.wind.speed} m/s</div>
    </div>
  )
}

export default Weather
