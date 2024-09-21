<template>
	<div>
		<div class="d-flex align-items-center justify-content-between mb-4 pt-3">
			<div class="fs-5 fw-bold">
				Lots
			</div>
			<a href="#" class="d-flex align-items-center fw-bold small" @click.prevent="getList()">
				<span>Reload</span>
			</a>
		</div>

		<div class="container">
			<div class="row gx-3">
				<div class="col-12 col-sm-6 col-lg-4 col-xl-3 mb-2 d-flex flex-column align-items-stretch"
					v-for="lot in lots">
					<div class="d-flex flex-column align-items-between h-100 border shadow-sm p-3">
						<LotInfo :lot="lot" :key="`${lot.id}-${lot.fetchTimestamp}`" />
						<router-link :to="`/lot/${lot.id}`" class="text-end mt-2">
							Enter
						</router-link>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import LotInfo from './lot/LotInfo.vue'
import { onMounted, ref, inject, onUnmounted } from 'vue';
import errorMessage from '@/helpers/errorMessage'
import { getLot } from '@/views/lot/lot.js'

const $swal = inject('$swal')
const $web3 = inject('$web3')

const lots = ref([])

onMounted(async () => {
	await getList()
})

const getList = async () => {
	try {
		const lotsCount = (await $web3.contract('auction').instance.lotIdx()).toString()
		for (let id = lotsCount; id > 0; id--) {
			const lot = await getLot(id)
			const idx = lots.value.find(l => l.id == id)
			if (idx) {
				lots.value[idx] = lot
			} else {
				lots.value.push(lot)
			}
		}
	} catch (error) {
		console.error(error)
		$swal.fire({
			icon: 'error',
			title: 'Lots fetch error',
			text: errorMessage(error),
			timer: 3000,
		});
	}
}	
</script>
