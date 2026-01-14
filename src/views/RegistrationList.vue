<template>
    <UsersDashboard />
    <ListUsers />
</template>

<script>
import ListUsers from '../components/ListCustomers.vue';
import UsersDashboard from '../components/CustomersDashboard.vue';

export default {
    name: 'RegistrationList',
    components: {
        ListUsers,
        UsersDashboard
    }
}
</script>