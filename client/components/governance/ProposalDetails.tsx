import { useReadContract } from 'wagmi'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Clock, CheckCircle, XCircle, Loader2, Vote } from 'lucide-react'
import { GOVERNOR_ADDRESS } from '../../lib/wagmi'
import { GOVERNOR_ABI } from '../../lib/contracts'

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

interface ProposalDetailsProps {
  proposalId: bigint
  onVote: () => void
  onBack: () => void
}

export function ProposalDetails({ proposalId, onVote, onBack }: ProposalDetailsProps) {
  const { data: state } = useReadContract({
    address: GOVERNOR_ADDRESS,
    abi: GOVERNOR_ABI,
    functionName: 'state',
    args: [proposalId],
  })

  const { data: votes } = useReadContract({
    address: GOVERNOR_ADDRESS,
    abi: GOVERNOR_ABI,
    functionName: 'proposalVotes',
    args: [proposalId],
  })

  const proposalState = state !== undefined ? PROPOSAL_STATES[state as keyof typeof PROPOSAL_STATES] : null
  const Icon = proposalState?.icon || Clock

  const forVotes = votes ? Number(votes[1]) / 1e18 : 0
  const againstVotes = votes ? Number(votes[0]) / 1e18 : 0
  const abstainVotes = votes ? Number(votes[2]) / 1e18 : 0
  const totalVotes = forVotes + againstVotes + abstainVotes

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-red-900/50 hover:bg-red-950/50"
        >
          ← Back to Proposals
        </Button>
        {proposalState && (
          <Badge className={`${proposalState.color} border`}>
            <Icon className="w-3 h-3 mr-1" />
            {proposalState.label}
          </Badge>
        )}
      </div>

      <Card className="p-8 border-red-900/30 bg-red-950/20">
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">Proposal #{proposalId.toString()}</div>
          <h2 className="text-3xl font-bold text-white mb-4">Proposal Title</h2>
          <p className="text-gray-300 leading-relaxed">
            Proposal details would be displayed here. In a production implementation, 
            this would show the full proposal description fetched from contract events.
          </p>
        </div>

        {state === 1 && (
          <Button
            onClick={onVote}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
          >
            <Vote className="w-4 h-4 mr-2" />
            Cast Your Vote
          </Button>
        )}
      </Card>

      <Card className="p-6 border-red-900/30 bg-red-950/20">
        <h3 className="text-xl font-semibold text-white mb-6">Voting Results</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">For</span>
              <span className="text-white font-semibold">{forVotes.toLocaleString()} AETH</span>
            </div>
            <div className="h-2 bg-black/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: `${totalVotes ? (forVotes / totalVotes) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Against</span>
              <span className="text-white font-semibold">{againstVotes.toLocaleString()} AETH</span>
            </div>
            <div className="h-2 bg-black/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500"
                style={{ width: `${totalVotes ? (againstVotes / totalVotes) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Abstain</span>
              <span className="text-white font-semibold">{abstainVotes.toLocaleString()} AETH</span>
            </div>
            <div className="h-2 bg-black/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500"
                style={{ width: `${totalVotes ? (abstainVotes / totalVotes) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-red-900/30">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total Votes</span>
            <span className="text-white font-semibold">{totalVotes.toLocaleString()} AETH</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
