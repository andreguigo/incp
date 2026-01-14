import { defineStore } from 'pinia'
import api from '@/api/axios'

export const useCustomerStore = defineStore('customer', {
    state: () => ({
        customers: [],
        currentCustomer: null,
        loading: false,
        error: null
    }),

    getters: {
        getCustomerById: (state) => (id) => {
            return state.customers.find(customer => customer.id === id)
        },
        totalCustomers: (state) => state.customers.length
    },

    actions: {
        async fetchCustomers() {
            this.loading = true
            this.error = null
            try {
                const response = await api.get('/customers')
                this.customers = response.data
            } catch (error) {
                this.error = error.message
                console.error('Erro ao buscar clientes:', error)
            } finally {
                this.loading = false
            }
        },

        async fetchCustomerById(id) {
            this.loading = true
            this.error = null
            try {
                const response = await api.get(`/customers/${id}`)
                this.currentCustomer = response.data
            } catch (error) {
                this.error = error.message
                console.error('Erro ao buscar cliente:', error)
            } finally {
                this.loading = false
            }
        },

        async createCustomer(customerData) {
            this.loading = true
            this.error = null
            try {
                const response = await api.post('/customers', customerData)
                return response
            } catch (error) {
                this.error = error.message
                console.error('Erro ao criar cliente:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async updateCustomer(id, customerData) {
            this.loading = true
            this.error = null
            try {
                const response = await api.put(`/customers/${id}`, customerData)
                const index = this.customers.findIndex(c => c.id === id)
                if (index !== -1) {
                this.customers[index] = response.data
                }
                return response.data
            } catch (error) {
                this.error = error.message
                console.error('Erro ao atualizar cliente:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async deleteCustomer(id) {
            this.loading = true
            this.error = null
            try {
                await api.delete(`/customers/${id}`)
                this.customers = this.customers.filter(c => c.id !== id)
            } catch (error) {
                this.error = error.message
                console.error('Erro ao deletar cliente:', error)
                throw error
            } finally {
                this.loading = false
            }
        }
    }
})