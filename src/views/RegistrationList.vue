<template>
    <UsersDashboard />
    <ListUsers />
</template>

<script>
import ListUsers from '../components/ListUsers.vue';
import UsersDashboard from '../components/UsersDashboard.vue';

export default {
    name: 'RegistrationList',
    components: {
        ListUsers,
        UsersDashboard
    }
}
</script>