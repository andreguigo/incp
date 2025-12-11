<template>
	<form @submit.prevent="submitForm">
		<div class="form-floating mb-3">
			<input type="text" class="form-control" placeholder="Nome Completo" v-model="formData.fullName">
			<label for="fullName">Nome Completo</label>
		</div>
		<div class="form-floating mb-3">
			<input
				type="text"
				class="form-control"
				v-model="formData.birthDate"
				v-mask="'##/##/####'"
				placeholder="dd/mm/aaaa"
			>
			<label for="birthDate">Data de Nascimento (somente números)</label>
		</div>
		<div class="form-floating mb-3">
			<input 
				type="tel"
				class="form-control"
				v-model="formData.phone"
				v-mask="['(##) ####-####', '(##) #####-####']"
				placeholder="(99) 99999-9999"
			>
			<label for="phone">Telefone</label>
		</div>
		<div class="form-floating mb-3 ">
			<p class="mb-2">Selecione até 3 áreas de voluntariado:</p>
			<div class="form-check form-switch" v-for="op in volunteerAreas" :key="op.value">
				<label>
					<input
						class="form-check-input"
						type="checkbox"
						:value="op.value"
						v-model="formData.selectedVolunteerArea"
						@change="limitSelection"
					/>
					{{ op.label }}
				</label>
			</div>
		</div>
		<div class="form-floating mb-3">
			<input
				type="text"
				class="form-control" 
				v-model="formData.baptismDate"
				v-mask="'##/##/####'"
				placeholder="dd/mm/aaaa"
			>
			<label for="baptismDate">Data de Batismo (somente números)</label>
		</div>
		<div class="form-floating mb-3">
			<select v-model="formData.selectedMemberDate" class="form-select">
				<option 
				v-for="year in memberDate"
				:key="year"
				:value="year"
				>{{ year }}</option>
			</select>
			<label for="memberDate">Ano que foi recebido(a) como Membro</label>
		</div>

		<h4 class="my-3">Agora sorria e tire uma selfie ;)</h4>
		<OpenCamera @photo-captured="handlePhotoCapture" />
		
		<div class="d-grid">
			<hr class="my-4">
			<button type="submit" class="btn btn-primary btn-lg rounded-pill px-3" :disabled="!isFormValid">
				<i class="bi bi-stars"></i> Registrar meu voluntariado
			</button>
		</div>
	</form>	

	<!-- alerts area -->
	<div
		class="position-fixed top-0 start-50 translate-middle-x mt-3 w-100"
      	style="max-width: 75%; z-index: 1080;"
	>
		<div
			v-for="(alert, index) in alerts"
			:key="index"
			:class="['alert', `alert-${alert.type}`, 'alert-dismissible', 'fade', 'show']"
			role="alert"
		>
			<div v-html="alert.message"></div>
			<!-- <button
				type="button"
				class="btn-close"
				@click="removeAlert(index)"
			></button> -->
		</div>
	</div>
</template>

<script>
import axios from 'axios';
import OpenCamera from './OpenCamera.vue';

export default {
	name: 'RegistryForm',
	components: {
		OpenCamera
	},
	data() {
		return {
			volunteerLimit: 3,
			volunteerAreas: [
				{ value: 'acolhimento', label: 'Acolhimento' },
				{ value: 'kids', label: 'Kids' },
				{ value: 'compaixão', label: 'Compaixão' },
				{ value: 'técnica', label: 'Técnica' },
				{ value: 'logística', label: 'Logística' },
				{ value: 'intercessão', label: 'Intercessão' },
				{ value: 'café', label: 'Café' },
				{ value: 'livraria', label: 'Livraria' },
			],
			memberDate: [],
			photoBlob: null,
			formData: {
				fullName: null,
				birthDate: null,
				phone: null,
				selectedVolunteerArea: [],
				baptismDate: null,
				selectedMemberDate: null
			},
			alerts: [],
			baseUrl: 'http://localhost:3000/public/',
		}
	},
	mounted() {
		this.yearsOptions();
	},
	computed: {
		isFormValid() {
			return Object.values(this.formData).every(field => 
				field !== "" && field !== null && field !== undefined && this.photoBlob
			);
		}
	},
	methods: {
		yearsOptions() {
			const currentYear = new Date().getFullYear();
			this.memberDate = [...Array(currentYear - 1997 + 1)].map((_, i) => 1997 + i);
		},
		handlePhotoCapture(blob) {
			this.photoBlob = blob;
		},
		limitSelection() {
			if (this.formData.selectedVolunteerArea.length > this.volunteerLimit) {
				this.formData.selectedVolunteerArea.pop();
				this.appendAlert(`<i class="bi bi-exclamation-circle"></i> Você só pode selecionar até ${this.volunteerLimit} opções.`, 'danger');
			}
		},
		async submitForm() {
			if (!this.photoBlob) return;
			
			const dataToSend = new FormData();

			const parseDate = (dateStr) => {
				if (!dateStr) return '';
				const parts = dateStr.split('/');
				if (parts.length !== 3) return '';
				return `${parts[2]}-${parts[1]}-${parts[0]}`; // YYYY-MM-DD
			};

			dataToSend.append('image', this.photoBlob, 'foto.jpg');
			dataToSend.append('fullName', this.formData.fullName.toLowerCase());
			dataToSend.append('birthDate', parseDate(this.formData.birthDate));
			dataToSend.append('phone', this.formData.phone);
			dataToSend.append('selectedVolunteerArea', Array.isArray(this.formData.selectedVolunteerArea)
															? this.formData.selectedVolunteerArea.join(',')
															: this.formData.selectedVolunteerArea);
			dataToSend.append('baptismDate', parseDate(this.formData.baptismDate));
			dataToSend.append('selectedMemberDate', this.formData.selectedMemberDate);

			if (this.validateInfoForm === true) return;

			try {
				const res = await axios.post(import.meta.env.VITE_API_URL, dataToSend);
				if (res.status === 200 || res.status === 201) {
					this.appendAlert('<i class="bi bi-check-lg"></i> Seu voluntariado foi registrado!', 'primary');
				}
			} catch (error) {
				this.appendAlert(`<i class="bi bi-exclamation-triangle"></i> Ocorreu um erro ao enviar o formulário: ${error.message}`, 'danger');
			} finally {
				this.formData = {
					fullName: null,
					birthDate: null,
					phone: null,
					selectedVolunteerArea: [],
					baptismDate: null,
					selectedMemberDate: null
				};
				this.photoBlob = null;
			}
		},
		validateInfoForm() {
			const hasEmpty = Object.values(this.formData).some(
				v => !v || v.toString().trim() === ''
			);

			return hasEmpty;
		},
		triggerAlert() {
			this.appendAlert(
				'Mensagem com <b>negrito</b> e um <a href="#">link</a>!',
				'warning',
			);
		},
		appendAlert(message, type, duration = 10000) {
			const id = Date.now() + Math.random();
			const alert = { id, message, type };
			this.alerts.push(alert);

			setTimeout(() => {
				this.alerts = this.alerts.filter(a => a.id !== id);
			}, duration);
		},
		removeAlert(index) {
			this.alerts.splice(index, 1);
		},
	}
}
</script>