import axios from 'axios'
const baseUrl = '/api/login'

const login = (userData) => {
  const request = axios.post(baseUrl,userData)
  return request.then(response => response.data)
}

export default { login }