import axios from "axios";
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {}
})

api.interceptors.request.use(config => {
    const auth = localStorage.getItem('authVolunteer')
    if (!auth) return config

    const { accessToken } = JSON.parse(auth)
    if (accessToken) {
        config.headers['Authorization'] = accessToken
    }

    return config
})

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            const auth = useAuthStore()
            auth.logout()
        }
        return Promise.reject(error)
    }
)

export default api;