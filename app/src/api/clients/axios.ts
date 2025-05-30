import axios from 'axios'

const prefix = '/api'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + prefix,
  timeout: 10000
})

export default api