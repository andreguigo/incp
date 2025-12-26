<template>
	<div class="container-fluid p-4">
		<h2>Dashboard</h2>		
    	<hr />
		<div class="card p-4 shadow-sm">
			<canvas ref="chartCanvas" height="120"></canvas>
		</div>
	</div>
</template>

<script>
import { useUserStore } from '@/stores/user';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
	name: "UsersDashboard",
	data() {
        return {
			listUsers: [],
			areas: [
				"Acolhimento",
				"Café",
				"Compaixão",
				"Intercessão",
				"Kids",
				"Livraria",
				"Logística",
				"Técnica"
			]
		};
	},
	async mounted() {
		await this.fetchUsers();
		
    	const ctx = this.$refs.chartCanvas;
		
		const counts = this.areas.map(a => this.countArea(a));

    	new Chart(ctx, {
			type: "line",
			data: {
				labels: this.areas,
				datasets: [{
					label: "",
					data: counts,
					borderWidth: 2,
					tension: 0,
					pointRadius: 2,
					fill: true
				}]
			},
			options: {
				plugins: { legend: { display: false } },
				scales: { y: { beginAtZero: false, suggestedMin: 1, suggestedMax: 20 } }
			}
		});
	},
	methods: {
		async fetchUsers() {
            const userStore = useUserStore();
            await userStore.fetchUsers();

            this.listUsers = userStore.users;
        },
		countArea(area) {
			return this.listUsers.reduce((acc, item) => {
				const list = item.selectedVolunteerArea					

				return acc + list.filter(a => a === area.toLowerCase()).length;
			}, 0);
		},
	}
};
</script>

<style scoped>
.dashboard-title { font-size: 2rem; font-weight: 600; }
</style>
