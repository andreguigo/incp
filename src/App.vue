<template>
	<div class="container py-5">
		<v-header />

		<main class="row gx-5 justify-content-center">
			<router-view />
		</main>
		
		<v-footer />
	</div>
</template>

<script>
import VFooter from './components/layout/VFooter.vue';
import VHeader from './components/layout/VHeader.vue';

export default {
	name: 'App',
	components: {
		VHeader,
		VFooter
	}
}
</script>