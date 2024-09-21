<template>
    <div class="d-flex justify-content-between">
        <span class="me-2">Lot Id:</span>
        {{ lot.id }}
    </div>
    <div class="d-flex justify-content-between">
        <span class="me-2">Creator:</span>
        <a :href="`${$web3.blockExplorer}/address/${lot.creator}`" target="_blank" rel="noopener noreferrer">
            {{ $web3.addressShort(lot.creator) }}
        </a>
    </div>

    <div class="d-flex justify-content-between">
        <span class="me-2">Status:</span>
        <template v-if="!isClosed(lot)">
            <span v-if="isActive(lot)">Bidding</span>
            <span v-if="isRevealing(lot)">Revealing</span>
        </template>
        <span v-else>Closed</span>
    </div>

    <div class="d-flex justify-content-between" v-if="!isClosed(lot)">
        <span class="me-2">Time left:</span>
        {{ timeLeft(lot) }}
    </div>

    <div class="d-flex justify-content-between">
        <span class="me-2">Participants:</span>
        <span>{{ lot.participants }}</span>

    </div>
    <div class="d-flex justify-content-between" v-if="false">
        <span class="me-2">Bidded:</span>
        {{ lot.bidded }}
    </div>
    
    <template v-if="isClosed(lot) && lot.participants > 0">
        <div class="d-flex justify-content-between">
            <span class="me-2">Winner:</span>
            <a :href="`${$web3.blockExplorer}/address/${lot.winner}`" target="_blank" rel="noopener noreferrer" v-if="hasWinner(lot)">
                {{ $web3.addressShort(lot.winner) }}
            </a>
            <span v-else>no winner</span>
        </div>

        <div class="d-flex justify-content-between" v-if="lot.winBid > 0">
            <span class="me-2">Win bid:</span>
            {{ lot.winBid }}
        </div>
    </template>
</template>

<script setup>
import { timeLeft, isActive, isRevealing, isClosed, hasWinner } from './lot.js'

const { lot } = defineProps({
    lot: { type: Object, required: true },
})

</script>