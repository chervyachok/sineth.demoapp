<template>
    <div class="container-lg mt-3">
        <div class="row justify-content-center gx-2">
            <div class="col-12 col-sm-6 mb-2 d-flex flex-column align-items-stretch">
                <div class="input-group mb-2">
                    <input type="number" class="form-control" v-model="bidStep" placeholder="bid step, wei" step="1"
                        min="1">
                    <input type="number" class="form-control" v-model="duration" placeholder="duration, sec" step="1"
                        min="1">
                    <button type="button" class="btn btn-outline-primary" @click="start()"
                        :disabled="!bidStep || !duration">
                        Start
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed, inject, onUnmounted } from 'vue';
import { useRouter } from 'vue-router'
import errorMessage from '@/helpers/errorMessage'

const $loader = inject('$loader')
const $web3 = inject('$web3')
const $swal = inject('$swal')
const $router = useRouter()

const bidStep = ref()
const duration = ref()

async function start() {
    $loader.show()

    try {
        const tx = await $web3.contract('auction').instance.connect($web3.account).start(bidStep.value, duration.value)
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
            $router.push({ path: '/lots' })
        } else {
            $swal.fire({
                icon: 'error',
                title: 'Transaction failed',
                timer: 3000,
            });
        }
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
</script>
