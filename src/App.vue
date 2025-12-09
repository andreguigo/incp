<template>
	<div class="container px-5 p-5">
		<div class="mb-5">
			<h1 class="display-3 fw-bolder">Registro de Voluntários</h1>
			<p class="text-default pt-2 mb-3 fs-3 fs-md-2 lh-xs">Registro de voluntários da Igreja do Nazareno Central de Paulista - PE</p>
		</div>
        <div class="row gx-5 justify-content-center">
			<router-view />
		</div>
	</div>	
</template>

<script>
export default {
	name: 'App'  
}
</script>