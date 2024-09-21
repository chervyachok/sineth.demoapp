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

const isActive = (lot) => {
  return $web3.timestamp < parseInt(lot.completeTs) 
}
const isRevealing = (lot) => {
  return $web3.timestamp > lot.completeTs && $web3.timestamp < lot.completeTs + ac.config.revealDuration
}
const isClosed = (lot) => {
  if (lot.closeTs > 0) return true
  return $web3.timestamp > lot.completeTs + ac.config.revealDuration 
}
const hasWinner = (lot) => {
  return !isAddressEqual(lot.winner, ethers.constants.AddressZero) && lot.winner !== '0x0000000000000000000000000000000000000001'
}
const timeLeft = (lot) => {
  if (isActive(lot)) return lot.completeTs - $web3.timestamp
  if (isRevealing(lot)) return lot.completeTs + ac.config.revealDuration - $web3.timestamp
  return 0
}

export {
  getLot,
  isActive,
  isRevealing,
  isClosed,
  timeLeft,
  hasWinner
}