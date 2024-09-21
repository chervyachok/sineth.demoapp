<template>
	<div v-if="lot">
		<div class="d-flex flex-column flex-sm-row align-items-sm-center justify-content-sm-between mb-4 pt-3">
			<div class="d-flex align-items-center justify-content-between mb-1 mb-sm-0 w-100">
				<div class="fs-5 fw-bold">
					Lot # {{ lot.id }}
				</div>
				<div>
					<a href="#" class="d-flex align-items-center fw-bold small" @click.prevent="$mitt.emit('update-lot')">
						<div class="_icon_reload bg-primary me-2"></div>
						<span>Reload</span>
					</a>
				</div>
			</div>
		</div>
		<div class="container-lg">
			<div class="row justify-content-center gx-2">
				<div class="col-12 col-sm-6 mb-2 d-flex flex-column align-items-stretch">
					<div class="d-flex flex-column align-items-between h-100 border shadow-sm p-3">
						<LotInfo :lot="lot" 
							:key="`${lot.id}-${lot.fetchTimestamp}`" />
					</div>
				</div>

				<div class="col-12 col-sm-6 d-flex align-items-stretch mb-2">
					<LotActions class="border shadow-sm w-100 h-100 p-2" :lot="lot"
						:key="`${lot.id}-${lot.fetchTimestamp}`" />
				</div>

				<div class="col-12 col-sm-8 d-flex align-items-stretch mb-2">
					<LotParticipants class="border shadow-sm w-100 p-2" :lot="lot"
						:key="`${lot.id}-${lot.fetchTimestamp}`" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import LotInfo from './lot/LotInfo.vue'
import LotActions from './lot/LotActions.vue'
import LotParticipants from './lot/LotParticipants.vue'

import { onMounted, ref, inject, onUnmounted } from 'vue';
import { useRoute } from 'vue-router'
import errorMessage from '@/helpers/errorMessage'
import { getLot } from '@/views/lot/lot.js'

const $route = useRoute()
const $loader = inject('$loader')
const $swal = inject('$swal')
const $mitt = inject('$mitt')

const lot = ref()

onMounted(async () => {
	await getLotData()
	$mitt.on('update-lot', getLotData)
})
onUnmounted(async () => {
	$mitt.off('update-lot')
})

async function getLotData() {
	$loader.show()
	try {
		lot.value = await getLot($route.params.id)
	} catch (error) {
		console.error(error)
		$swal.fire({
			icon: 'error',
			title: 'Lot fetch error',
			text: errorMessage(error),
			timer: 3000,
		});
	}
	$loader.hide()
}
</script>