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
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
	name: "UsersDashboard",
	data() {
        return {
			myListUsers: [],
			areas: [
				"Acolhimento",
				"Kids",
				"Compaixão",
				"Técnica",
				"Logística",
				"Intercessão",
				"Café",
				"Livraria"
			]
		};
	},
	async mounted() {
		await this.listUsers();
		
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
					tension: 0.3,
					pointRadius: 4,
					fill: false
				}]
			},
			options: {
				plugins: { legend: { display: false } },
				scales: { y: { beginAtZero: false, suggestedMin: 1, suggestedMax: 20 } }
			}
		});
	},
	methods: {
		async listUsers() {
            await axios.get('http://localhost:3000/api')
                .then(response => { 
                    this.myListUsers = response.data 
                })
                .catch(error => {
                    console.error('Erro ao listar usuários:', error);
                });
        },
		countArea(area) {
			return this.myListUsers.reduce((acc, item) => {
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
