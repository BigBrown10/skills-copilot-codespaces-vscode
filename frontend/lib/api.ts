import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        window.location.href = '/login'
      }
    }

    // Handle other errors
    const errorMessage = error.response?.data || error.message || 'An error occurred'
    console.error('API Error:', errorMessage)

    return Promise.reject(error)
  }
)

export default api
