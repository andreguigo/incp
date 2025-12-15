import { defineStore } from 'pinia'
import api from '@/api/axios'

export const useUserStore = defineStore('user', {
    state: () => ({
        users: [],
        currentUser: null,
        loading: false,
        error: null
    }),

    getters: {
        getUserById: (state) => (id) => {
            return state.users.find(user => user.id === id)
        },
        totalUsers: (state) => state.users.length
    },

    actions: {
        async fetchUsers() {
            this.loading = true
            this.error = null
            try {
                const response = await api.get('/users')
                this.users = response.data
            } catch (error) {
                this.error = error.message
                console.error('Erro ao buscar usuários:', error)
            } finally {
                this.loading = false
            }
        },

        async fetchUserById(id) {
            this.loading = true
            this.error = null
            try {
                const response = await api.get(`/users/${id}`)
                this.currentUser = response.data
            } catch (error) {
                this.error = error.message
                console.error('Erro ao buscar usuário:', error)
            } finally {
                this.loading = false
            }
        },

        async createUser(userData) {
            this.loading = true
            this.error = null
            try {
                const response = await api.post('/users', userData)
                return response
            } catch (error) {
                this.error = error.message
                console.error('Erro ao criar usuário:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async updateUser(id, userData) {
            this.loading = true
            this.error = null
            try {
                const response = await api.put(`/users/${id}`, userData)
                const index = this.users.findIndex(u => u.id === id)
                if (index !== -1) {
                this.users[index] = response.data
                }
                return response.data
            } catch (error) {
                this.error = error.message
                console.error('Erro ao atualizar usuário:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async deleteUser(id) {
            this.loading = true
            this.error = null
            try {
                await api.delete(`/users/${id}`)
                this.users = this.users.filter(u => u.id !== id)
            } catch (error) {
                this.error = error.message
                console.error('Erro ao deletar usuário:', error)
                throw error
            } finally {
                this.loading = false
            }
        }
    }
})