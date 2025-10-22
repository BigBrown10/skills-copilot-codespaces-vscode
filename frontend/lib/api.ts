import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      window.location.href = '/auth/signin'
    }
    return Promise.reject(error)
  }
)

// API Methods
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
}

export const botsApi = {
  getAll: () => api.get('/bots'),
  getById: (id: string) => api.get(`/bots/${id}`),
  create: (data: any) => api.post('/bots', data),
  update: (id: string, data: any) => api.put(`/bots/${id}`, data),
  delete: (id: string) => api.delete(`/bots/${id}`),
}

export const conversationsApi = {
  getAll: (params?: any) => api.get('/conversations', { params }),
  getById: (id: string) => api.get(`/conversations/${id}`),
  getMessages: (id: string) => api.get(`/conversations/${id}/messages`),
}

export const analyticsApi = {
  getOverview: () => api.get('/analytics/overview'),
  getBotStats: (botId: string) => api.get(`/analytics/bots/${botId}`),
  getConversationStats: (params?: any) =>
    api.get('/analytics/conversations', { params }),
}

export const usersApi = {
  getAll: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
}

export default api
