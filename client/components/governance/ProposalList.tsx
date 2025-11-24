import { useReadContract } from 'wagmi'
import { GOVERNOR_ADDRESS } from '../../lib/wagmi'
import { GOVERNOR_ABI } from '../../lib/contracts'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react'

const PROPOSAL_STATES = {
  0: { label: 'Pending', icon: Clock, color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  1: { label: 'Active', icon: Loader2, color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  2: { label: 'Canceled', icon: XCircle, color: 'bg-gray-500/10 text-gray-500 border-gray-500/20' },
  3: { label: 'Defeated', icon: XCircle, color: 'bg-red-500/10 text-red-500 border-red-500/20' },
  4: { label: 'Succeeded', icon: CheckCircle, color: 'bg-green-500/10 text-green-500 border-green-500/20' },
  5: { label: 'Queued', icon: Clock, color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  6: { label: 'Expired', icon: XCircle, color: 'bg-gray-500/10 text-gray-500 border-gray-500/20' },
  7: { label: 'Executed', icon: CheckCircle, color: 'bg-green-500/10 text-green-500 border-green-500/20' },
}

interface Proposal {
  id: bigint
  title: string
  description: string
  state: number
}

export function ProposalList({ onSelectProposal }: { onSelectProposal: (id: bigint) => void }) {
  // In a real implementation, you'd query proposal events
  // For now, showing empty state
  const proposals: Proposal[] = []

  if (proposals.length === 0) {
    return (
      <Card className="p-12 text-center border-red-900/30 bg-red-950/20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-red-900/30 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">No Proposals Yet</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Be the first to create a governance proposal. Connect your wallet and click "Create Proposal" to get started.
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {proposals.map((proposal) => {
        const state = PROPOSAL_STATES[proposal.state as keyof typeof PROPOSAL_STATES]
        const Icon = state.icon

        return (
          <Card
            key={proposal.id.toString()}
            className="p-6 border-red-900/30 bg-red-950/20 hover:bg-red-950/30 cursor-pointer transition-all"
            onClick={() => onSelectProposal(proposal.id)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{proposal.title}</h3>
                  <Badge className={`${state.color} border`}>
                    <Icon className="w-3 h-3 mr-1" />
                    {state.label}
                  </Badge>
                </div>
                <p className="text-gray-400 line-clamp-2">{proposal.description}</p>
              </div>
              <div className="text-sm text-gray-500">
                #{proposal.id.toString()}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
