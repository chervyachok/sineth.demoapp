<template>
    <div class="p-3" v-if="lot">
        <div class="d-flex justify-content-between mb-1">
            <div>
                Bidding token balance:
            </div>
            <div>
                {{ tokenBalance }}
            </div>
        </div>
        <div class="d-flex justify-content-between mb-1" v-if="isActive(lot)">
            <div>
                Locked by you:
            </div>
            <div>
                {{ tokenLocked }}
            </div>
        </div>
        <div class="d-flex justify-content-between" v-if="!isRevealing(lot) && !isClosed(lot)">
            <div>
                Available for bidding:
            </div>
            <div>
                {{ availableForBidding }}
            </div>
        </div>

        <!--Bid-->
        <div class="input-group mb-2" v-if="!isRevealing(lot) && !isClosed(lot)">
            <input type="number" class="form-control" v-model="bidFrom" step="1" min="1">
            <input type="number" class="form-control" v-model="bidTo" step="1" min="1">
            <button type="button" class="btn btn-outline-primary" @click="placeBid()" :disabled="!bidAllowed">
                Place bid
            </button>
        </div>

        <!--Uniqueness-->
        <div class="mb-2" v-if="lot.participants > 0">
            <div class="text-end">
                <button type="button" class="btn btn-outline-primary" @click="getUniqueness()">
                    Check uniqueness
                </button>
            </div>

            <div class="d-flex justify-content-between" v-if="checkResult">
                <div>
                    Lot has unique bid:
                </div>
                <div>
                    {{ checkResult.lot ? 'yes' : 'no' }}
                </div>
            </div>

            <div class="d-flex justify-content-between" v-if="checkResult">
                <div>
                    You have unique bid:
                </div>
                <div>
                    {{ checkResult.account ? 'yes' : 'no' }}
                </div>
            </div>
        </div>

        <!--Result-->
        <div class="mb-2">
            <div class="text-end" v-if="isRevealing(lot) && lot.participants > 0">
                <button type="button" class="btn btn-outline-primary mb-1" @click="getResult()">
                    Compute result
                </button>
            </div>

            <div class="d-flex justify-content-between" v-if="computeResult">
                <div>
                    Lot winner:
                </div>
                <div>
                    <a :href="`${$web3.blockExplorer}/address/${computeResult.winner}`" target="_blank"
                        rel="noopener noreferrer">
                        {{ $web3.addressShort(computeResult.winner) }}
                    </a>
                </div>
            </div>

            <div class="d-flex justify-content-between" v-if="computeResult">
                <div>
                    Winner bid:
                </div>
                <div>
                    {{ computeResult.lastBid }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed, inject, onUnmounted, watch } from 'vue';
import errorMessage from '@/helpers/errorMessage'
import { ethers, utils } from 'ethers'
import { isActive, isRevealing, isClosed } from './lot.js'

const { lot } = defineProps({ lot: { type: Object, required: true } })

const $loader = inject('$loader')
const $swal = inject('$swal')
const $web3 = inject('$web3')
const $mitt = inject('$mitt')

const bidFrom = ref()
const bidTo = ref()

const tokenBalance = ref()
const tokenLockedTotal = ref()
const tokenLocked = ref()
const checkResult = ref()
const computeResult = ref()
const finalResult = ref()
const completeSig = ref()

onMounted(async () => {
    getBalances()
})

watch(() => $web3.account?.address, () => {
    getBalances()
    checkResult.value = null
    computeResult.value = null
})

const availableForBidding = computed(() => {
    if (!tokenBalance.value) return 0
    return tokenBalance.value - tokenLocked.value
})

const bidAllowed = computed(() => {
    if (!bidFrom.value) return false
    if (!bidTo.value) return false
    if (bidFrom.value > bidTo.value) return false
    if (bidTo.value > availableForBidding.value) return false
    return true
})

const getBalances = async () => {
    try {
        const data = await $web3.contract('auction').instance.connect($web3.account).getAccount()
        tokenBalance.value = data.balance
        tokenLockedTotal.value = data.locked
        const lotParticipated = data.list.find(l => l.lotId.toString() == lot.id)
        tokenLocked.value = lotParticipated ? lotParticipated.amount.toString() : 0
        if (lot.participants > 0) getUniqueness()
    } catch (error) {
        console.log('getBalances error', error)
    }
}

async function placeBid() {
    $loader.show()
    try {
        let tx = await $web3.contract('auction').instance.connect($web3.account).placeBids(lot.id, range(bidFrom.value, bidTo.value))
        $swal.fire({
            icon: 'success',
            title: 'Transaction sent',
            text: 'Please wait for confirm',
            timer: 3000,
        });
        const recipe = await tx.wait()
        if (recipe.status) {
            $swal.fire({
                icon: 'success',
                title: 'Transaction completed',
                timer: 3000,
            });
        } else {
            $swal.fire({
                icon: 'error',
                title: 'Transaction failed',
                timer: 3000,
            });
        }
        getBalances()
        $mitt.emit('update-lot')
    } catch (error) {
        console.error(error)
        $swal.fire({
            icon: 'error',
            title: 'Transaction error',
            text: errorMessage(error),
            timer: 3000,
        });
    }
    $loader.hide()
}

function range(start, end) {
    return Array.from({ length: end - start + 1 }, (v, k) => k + start);
}

async function getUniqueness() {
    $loader.show()
    try {
        let completed
        let cache = '0x00'
        while (!completed) {
            const response = await $web3.contract('auction').instance.connect($web3.account).checkUniqueness(lot.id, cache)
            console.log('checkUniqueness response', cache)
            cache = response.newResultData
            completed = response.completed
        }
        const r = utils.defaultAbiCoder.decode(['uint32 lotId', 'uint16 lastBid', 'bool account', 'bool lot'], cache)
        console.log('checkUniqueness result', r)
        checkResult.value = {
            account: r.account,
            lot: r.lot
        }
    } catch (error) {
        console.error(error)
        $swal.fire({
            icon: 'error',
            title: 'Uniqueness check error',
            text: errorMessage(error),
            timer: 3000,
        });
    }
    $loader.hide()
}

async function getResult() {
    $loader.show()
    try {
        let completed
        let prevResultData = '0x00'
        let prevSignature = '0x00'
        let decoded;
        while (!completed) {
            const r = await $web3.contract('auction').instance.connect($web3.account).computeResult(lot.id, prevResultData, prevSignature)
            console.log(r)
            prevResultData = r.newResultData
            prevSignature = r.newSignature

            decoded = utils.defaultAbiCoder.decode(['uint32 lotId', 'uint16 lastBid', 'address winner'], r.newResultData)
            console.log('computeResult response', decoded.lastBid.toString(), decoded.winner)

            completed = r.completed
        }

        computeResult.value = decoded
        completeSig.value = prevSignature
        console.log('winner', decoded)

    } catch (error) {
        console.error(error)
        $swal.fire({
            icon: 'error',
            title: 'Uniqueness check error',
            text: errorMessage(error),
            timer: 3000,
        });
    }
    $loader.hide()
}
</script>