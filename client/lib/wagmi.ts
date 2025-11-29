import { http, createConfig } from 'wagmi'
import { sepolia, polygon } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [sepolia, polygon],
  connectors: [
    injected(),
    walletConnect({ projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo' }),
  ],
  transports: {
    [sepolia.id]: http(),
    [polygon.id]: http(),
  },
})

export type SupportedNetwork = 'sepolia' | 'polygon'

export interface NetworkContracts {
  governor: `0x${string}`
  token: `0x${string}`
  timelock: `0x${string}`
  tokenSymbol: string
  tokenName: string
  explorerUrl: string
  explorerName: string
  chainId: number
  networkName: string
  tallyUrl?: string
  isTestnet: boolean
}

export const NETWORK_CONTRACTS: Record<SupportedNetwork, NetworkContracts> = {
  sepolia: {
    governor: '0x6660344dA659aAcA0a7733dd70499be7ffa9F4Fa',
    token: '0xf846380e25b34B71474543fdB28258F8477E2Cf1',
    timelock: '0xDA8B4b2125B8837cAaa147265B401056b636F1D5',
    tokenSymbol: 'AETH',
    tokenName: 'AeThex Governance',
    explorerUrl: 'https://sepolia.etherscan.io',
    explorerName: 'Etherscan',
    chainId: 11155111,
    networkName: 'Ethereum Sepolia',
    tallyUrl: 'https://www.tally.xyz/gov/aethex',
    isTestnet: true,
  },
  polygon: {
    governor: '0x6660344dA659aAcA0a7733dd70499be7ffa9F4Fa',
    token: '0xf846380e25b34B71474543fdB28258F8477E2Cf1',
    timelock: '0xDA8B4b2125B8837cAaa147265B401056b636F1D5',
    tokenSymbol: 'AETHEX',
    tokenName: 'AeThex | Token',
    explorerUrl: 'https://polygonscan.com',
    explorerName: 'Polygonscan',
    chainId: 137,
    networkName: 'Polygon',
    tallyUrl: 'https://www.tally.xyz/gov/aethex-polygon',
    isTestnet: false,
  },
}

export function getContractsForChain(chainId: number): NetworkContracts | null {
  if (chainId === 11155111) return NETWORK_CONTRACTS.sepolia
  if (chainId === 137) return NETWORK_CONTRACTS.polygon
  return null
}

export const GOVERNOR_ADDRESS = '0x6660344dA659aAcA0a7733dd70499be7ffa9F4Fa' as const
export const TOKEN_ADDRESS = '0xf846380e25b34B71474543fdB28258F8477E2Cf1' as const
export const TIMELOCK_ADDRESS = '0xDA8B4b2125B8837cAaa147265B401056b636F1D5' as const
