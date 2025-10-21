import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    // TODO: Add authentication token from session
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// API methods
export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    apiClient.post('/auth/login', credentials),
  
  register: (data: { email: string; password: string; name: string }) =>
    apiClient.post('/auth/register', data),

  // Bots
  getBots: () => apiClient.get('/bots'),
  getBot: (id: string) => apiClient.get(`/bots/${id}`),
  createBot: (data: any) => apiClient.post('/bots', data),
  updateBot: (id: string, data: any) => apiClient.put(`/bots/${id}`, data),
  deleteBot: (id: string) => apiClient.delete(`/bots/${id}`),

  // Conversations
  getConversations: () => apiClient.get('/conversations'),
  getConversation: (id: string) => apiClient.get(`/conversations/${id}`),

  // Analytics
  getAnalytics: () => apiClient.get('/analytics'),
  getBotAnalytics: (botId: string) => apiClient.get(`/analytics/bots/${botId}`),

  // Users
  getCurrentUser: () => apiClient.get('/users/me'),
  updateProfile: (data: any) => apiClient.put('/users/me', data),
}

export default api
