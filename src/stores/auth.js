import { defineStore } from 'pinia'
import api from '@/api/axios'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false
    }),

    actions: {
        async login(credentials) {
            this.loading = true

            try {
                const { data } = await api.post('/users/signin', credentials)
                
                this.token = data.accessToken
                this.user = {
                    id: data.id,
                    username: data.username,
                }
                this.isAuthenticated = true
                
                localStorage.setItem('authVolunteer', JSON.stringify({ ...this.user, accessToken: this.token }))

                router.push('/dashboard')
            } catch (error) {
                return {
                    success: false,
                    message: error.response?.data?.message
                }
            } finally {
                this.loading = false
            }
        },

        init() {
            const storedAuth = localStorage.getItem('authVolunteer')
            if (!storedAuth) return

            const auth = JSON.parse(storedAuth)
            const token = auth.accessToken

            if (!token || this.isTokenExpired(token)) {
                this.logout()
                return
            }

            this.token = token
            this.user = auth
            this.isAuthenticated = true
        },

        isTokenExpired(token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]))
                const now = Math.floor(Date.now() / 1000)
                return payload.exp < now
            } catch {
                return true
            }
        },

        logout() {
            this.token = null
            this.isAuthenticated = false
            localStorage.removeItem('authVolunteer')
            router.push('/signin')
        }
    }
})