import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from './ui/button'
import { Wallet, LogOut } from 'lucide-react'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-red-950/30 border border-red-900/50 rounded-lg">
          <Wallet className="w-4 h-4 text-yellow-500" />
          <span className="text-sm text-gray-300 font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <Button
          onClick={() => disconnect()}
          variant="outline"
          size="sm"
          className="border-red-900/50 hover:bg-red-950/50"
        >
          <LogOut className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Disconnect</span>
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={() => connect({ connector: connectors[0] })}
      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
    >
      <Wallet className="w-4 h-4 mr-2" />
      Connect Wallet
    </Button>
  )
}
