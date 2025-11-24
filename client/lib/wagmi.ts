import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected(),
    walletConnect({ projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo' }),
  ],
  transports: {
    [sepolia.id]: http(),
  },
})

export const GOVERNOR_ADDRESS = '0x6660344dA659aAcA0a7733dd70499be7ffa9F4Fa' as const
export const TOKEN_ADDRESS = '0xf846380e25b34B71474543fdB28258F8477E2Cf1' as const
export const TIMELOCK_ADDRESS = '0xDA8B4b2125B8837cAaa147265B401056b636F1D5' as const
