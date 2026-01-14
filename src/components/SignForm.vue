<template>
    <form @submit.prevent="submitForm">
        <div class="form-signin text-center">
            <h1 class="h3 mb-3 fw-normal">Login</h1>
            <div class="form-floating">
                <input type="text" class="form-control" placeholder="Usuário" v-model="formData.username">
                <label for="username">Usuário</label>
            </div>
            <div class="form-floating">
                <input type="password" class="form-control" placeholder="Senha" v-model="formData.password">
                <label for="password">Senha</label>
            </div>
            <div class="d-grid">
                <hr class="my-4">
                <button type="submit" class="btn btn-primary btn-lg rounded-pill px-3" :disabled="!isFormValid">
                    <i class="bi bi-box-arrow-in-right"></i> Continue
                </button>
            </div>
        </div>
    </form>
</template>

<script>
import { useAuthStore } from '@/stores/auth';

export default {
    name: 'SignForm',
    data() {
        return {
            formData: {
                username: '',
                password: ''
            }
        }
    },
    computed: {
		isFormValid() {
			return Object.values(this.formData).every(field => 
				field !== "" && field !== null && field !== undefined
			);
		}
	},
    methods: {
        async submitForm() {
            const loginStore = useAuthStore();
            await loginStore.login(this.formData);
        }
    },
}
</script>