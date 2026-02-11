<template>
    <CurrentUser />
    <CustomersDashboard />
    <ListCustomers />
</template>

<script>
import CurrentUser from '../components/CurrentUser.vue';
import CustomersDashboard from '../components/CustomersDashboard.vue';
import ListCustomers from '../components/ListCustomers.vue';

export default {
    name: 'RegistrationList',
    components: {
        CurrentUser,
        CustomersDashboard,
        ListCustomers
    }
}
</script>