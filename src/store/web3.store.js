import bcConfig_all from '../../../bcConfig_auction.json';

import dayjs from 'dayjs';
import { defineStore } from 'pinia';
import { isAddressEqual, formatUnits, createPublicClient, defineChain } from 'viem';
import { ref, markRaw } from 'vue';
import { ethers } from 'ethers';
import * as sapphire from '@oasisprotocol/sapphire-paratime'

const bcConfig = bcConfig_all
const chainId = bcConfig.chainId
const provider = markRaw(new ethers.providers.JsonRpcProvider(bcConfig.rpcUrl, 'any'))
const blockExplorer = 'https://some.explorer'

export const web3Store = defineStore('web3', () => {
  let wallets = [
    new ethers.Wallet('0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a', provider),
    new ethers.Wallet('0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6', provider),
    new ethers.Wallet('0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a', provider),
  ]

  if (chainId == 23293) {
    wallets = wallets.map(w => sapphire.wrap(w))
  }
  
  const account = ref(wallets[0]);
  const setAccount = (acc) => {
    account.value = acc;
  };

  const timestamp = ref(dayjs().unix());
  setTimeout(async function tick() {
    timestamp.value = dayjs().unix();
    setTimeout(tick, 1000);
  }, 100);

  const txHashShort = (txHash) => {
    if (txHash) return txHash.replace(txHash.substring(8, 60), '.....');
    return '.....';
  };

  const addressShort = (tokenAddress) => {
    if (tokenAddress) return tokenAddress.replace(tokenAddress.substring(6, 38), '...');
    return '...';
  };

  function contract(contractName) {
    return {
        instance: new ethers.Contract(bcConfig[contractName].address, bcConfig[contractName].abi, provider),
        config: bcConfig[contractName].config,
    };
  }

  return {
    bcConfig,
    blockExplorer,
    wallets,
    account,
    setAccount,
    provider,
    timestamp,
    txHashShort,
    addressShort,
	  formatUnits,
    contract,
  };
});
