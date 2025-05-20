import axios from 'axios'

const prefix = '/api'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + prefix,
  timeout: 10000
})

api.interceptors.response.use(
  response => response,
  error => {
    console.log(error)
    if (error.response && error.response.status === 401) {
      window.location.href = '/error';
    }
    return Promise.reject(error);
  }
);

export default api