<template>
	<!-- Navbar -->

	<div class="d-flex justify-content-center align-items-center mt-2">
		<div class="fw-bold me-2">LUB Auction</div>
		<router-link to="/start" class=" mx-2">
			Start
		</router-link>
		

		<div class="dropdown font-monospace" >
			<button class="btn btn-outline-primary btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
				{{ $web3.addressShort($web3.account.address) }}
			</button>
			<ul class="dropdown-menu">
				<li v-for="acc in $web3.wallets">
					<a class="dropdown-item d-flex align-items-center" href="#" @click.prevent="$web3.setAccount(acc)">
						{{ $web3.addressShort(acc.address) }}
					</a>
				</li>
			</ul>
		</div>
	</div>

	<div class="container-fluid pb-3" >
		<div class="container">
			<router-view v-slot="{ Component, route }">
				<component :is="Component" :key="route.path" />
			</router-view>
		</div>
	</div>

	<Loader />
</template>


<script setup>
import Loader from '@/views/components/Loader.vue';
</script>