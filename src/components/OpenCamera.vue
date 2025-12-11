<template>
	<div class="row justify-content-md-center text-center">
		<div class="col col-lg-6">
			<button type="button" class="btn btn-primary btn-lg rounded-pill px-3" @click="startCamera" v-if="!areaCamera"><i class="bi bi-camera-video"></i> Abrir câmera</button>
			<button type="button" class="btn btn-primary btn-lg rounded-pill px-3" @click="stopCamera" v-else><i class="bi bi-camera-video-off-fill"></i> Fechar câmera</button>
			<div class="m-2" v-if="areaCamera">
				<div>
					<CustomLoader v-if="!stream" />
					<video
						class="img-fluid rounded"
						ref="video"
						autoplay
						playsinline
						width="300"
					></video>
					<br />
					<button type="button" class="btn btn-primary btn-lg rounded-circle p-3 lh-1 m-2" @click="capturePhoto"><i class="bi bi-camera"></i></button>
				</div>
				
				<div v-if="photoDataUrl">
					<h4>Prévia da sua foto</h4>
					<img class="rounded mx-auto d-block" :src="photoDataUrl" width="200" /> 
				</div>

				<!-- <button class="btn btn-primary btn-lg rounded-pill px-3 m-2" @click="sendPhoto" :disabled="!photoBlob">Enviar foto</button> -->
			</div>
		</div>
	</div>
</template>

<script>
import axios from "axios";
import CustomLoader from './ui/CustomLoader.vue';

export default {
	name: 'OpenCamera',
	components: {
		CustomLoader
	},
	data() {
		return {
			areaCamera: false,
			stream: null,
			photoBlob: null,
			photoDataUrl: null
		}
	},
	methods: {
		async startCamera() {
			this.areaCamera = true;
			try {
				this.stream = await navigator.mediaDevices.getUserMedia({
					video: true,
					audio: false
				});

				this.$refs.video.srcObject = this.stream;
			} catch (err) {
				console.log('Error accessing camera', err);
			}
		},
		async capturePhoto() {
			const video = this.$refs.video;

			const scale = Math.min(256 / video.videoWidth, 256 / video.videoHeight, 1);
			const w = video.videoWidth * scale;
			const h = video.videoHeight * scale;

			const canvas = document.createElement('canvas');
			canvas.width = w;
			canvas.height = h;

			canvas.getContext('2d').drawImage(video, 0, 0, w, h);

			const compressToMaxSize = (canvas, maxKb = 256) => {
				return new Promise(resolve => {
					let quality = 0.9;

					const attemptCompress = () => {
						canvas.toBlob(blob => {
							if (blob.size / 1024 <= maxKb || quality <= 0.1) {
								resolve(blob);
							} else {
								quality -= 0.1;
								attemptCompress();
							}
						}, 'image/jpeg', quality);
					};

					attemptCompress();
				});
			}

			const finalBlob = await compressToMaxSize(canvas, 256);

			this.photoBlob = finalBlob;
			this.photoDataUrl = URL.createObjectURL(finalBlob);

			this.$emit('photo-captured', this.photoBlob);
		},
		stopCamera() {
			this.areaCamera = false;
			this.stream = null;
			
      		const tracks = this.$refs.video.srcObject.getTracks();

			tracks.forEach(track => {
				track.stop();
			});
    	},
		async sendPhoto() {
			this.stopCamera();
			
			if (!this.photoBlob) return;

			const formData = new FormData();
			formData.append('foto', this.photoBlob, 'foto.jpg');

			try {
				const response = await axios.post(import.meta.env.API_URL, 
					formData, {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				});
				console.log('Upload success:', response);
				alert('Send photo');
			} catch (err) {
				console.log('Error in sending:', err);
				alert('Error in photo sending');
			} finally {
				this.photoBlob = null;
				this.photoDataUrl = null;
			}
		}
	}
}
</script>