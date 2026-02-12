<template>
    <div class="navbar justify-content-end border-bottom">
        <span class="nav-link link-secondary me-2"> <i class="bi bi-person-check-fill"></i> {{ currentUser.username }}</span>
        <button class="btn btn-danger btn-sm" @click="logout">Sair <i class="bi bi-box-arrow-right"></i></button>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';

export default {
    name: 'UserId',
    data() {
        return {
            currentUser: []
        };
    },
    methods: {
        fetchCurrentUser() {
            const authStore = useAuthStore();

            this.currentUser = { 
                username: authStore.fetchCurrentUser().username,
                role: authStore.getUserRole(authStore.token)
            };
        },
        logout() {
            const authStore = useAuthStore();
            authStore.logout();
            this.$router.push('/signin');
        }
    },
    mounted() {
        this.fetchCurrentUser();
    }
}
</script>