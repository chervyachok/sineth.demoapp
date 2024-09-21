import dayjs from 'dayjs'
import { web3Store } from '@/store/web3.store'

const $web3 = web3Store()
const ac = $web3.contract('auction')

const getLot = async (id) => {
  const lotData = await ac.instance.getLot(id)
    return {
      id,
      fetchTimestamp: dayjs().valueOf(),
      creator: lotData.creator,
      startTs: parseInt(lotData.startTs.toString()),
      closeTs: parseInt(lotData.closeTs.toString()),
      completeTs: parseInt(lotData.completeTs.toString()),
      winner: lotData.winner,
      bidStep: lotData.bidStep.toString(),
      participants: parseInt(lotData.participants),
      bidded: parseInt(lotData.bidded.toString()),
      winBid: lotData.winBid.toString()
    }
}

export {
  getLot
}