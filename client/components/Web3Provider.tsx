import { WagmiProvider } from 'wagmi'
import { config } from '../lib/wagmi'

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      {children}
    </WagmiProvider>
  )
}
