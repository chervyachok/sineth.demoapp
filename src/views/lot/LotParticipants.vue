<template>  
    <div>
        <div v-if="lot.participants > 0">
            <div class="d-flex justify-content-center" v-for="participant in participants">
                <a :href="`${$web3.blockExplorer}/address/${participant}`" target="_blank" rel="noopener noreferrer">
                    {{ $web3.addressShort(participant) }}
                </a>       
            </div> 
        </div>
        <div v-else class="text-center">No participants</div>
    </div>
</template>

<script setup>  
    import { ref, onMounted, onUnmounted, inject, computed } from 'vue';
    
    const $web3 = inject('$web3')
    const { lot } = defineProps({
        lot: { type: Object, required: true },
    })
        
    const participants = ref([])
   
    onMounted(() => { 
        getList()   
    })

    async function getList() {	
        if (!lot.participants) return
        try {  
            const participantsData = await $web3.contract('auction').instance.getParticipants(lot.id)
			participants.value = participantsData.map(p => p)
        } catch (error) {                    
            console.log(error)
        } 
    }
</script>
