import axios from 'axios'

const apiKey = import.meta.env.VITE_WEATHER_KEY
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'

const getWeather = (capital) => {
  return axios.get(baseUrl, {
    params: {
      q: capital,
      appid: apiKey,
      units: 'metric'
    }
  })
}

export default { getWeather }
