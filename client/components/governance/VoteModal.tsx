import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Loader2, ThumbsUp, ThumbsDown, Minus, CheckCircle } from 'lucide-react'
import { useToast } from '../../hooks/use-toast'
import { GOVERNOR_ADDRESS } from '../../lib/wagmi'
import { GOVERNOR_ABI } from '../../lib/contracts'

interface VoteModalProps {
  proposalId: bigint
  onClose: () => void
}

export function VoteModal({ proposalId, onClose }: VoteModalProps) {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { toast } = useToast()
  const [selectedVote, setSelectedVote] = useState<0 | 1 | 2 | null>(null) // 0=Against, 1=For, 2=Abstain

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleVote = async () => {
    if (selectedVote === null) return

    try {
      writeContract({
        address: GOVERNOR_ADDRESS,
        abi: GOVERNOR_ABI,
        functionName: 'castVote',
        args: [proposalId, selectedVote],
      } as any, {
        onSuccess: () => {
          toast({
            title: "Vote Submitted",
            description: "Your vote is being recorded on-chain...",
          })
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          })
        },
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit vote",
        variant: "destructive",
      })
    }
  }

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={onClose}>
        <Card 
          className="max-w-md w-full p-8 border-red-900/30 bg-gradient-to-br from-red-950/90 to-black/90 backdrop-blur-xl text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Vote Cast!</h3>
              <p className="text-gray-400 mb-6">Your vote has been recorded on-chain.</p>
              <Button onClick={onClose} className="bg-gradient-to-r from-red-600 to-red-700">
                Close
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <Card 
        className="max-w-md w-full p-6 border-red-900/30 bg-gradient-to-br from-red-950/90 to-black/90 backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold text-white mb-2">Cast Your Vote</h3>
        <p className="text-gray-400 mb-6">
          Proposal #{proposalId.toString()}
        </p>

        <div className="space-y-3 mb-6">
          <button
            onClick={() => setSelectedVote(1)}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              selectedVote === 1
                ? 'border-green-500 bg-green-500/20'
                : 'border-gray-700 hover:border-green-500/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <ThumbsUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-white">Vote For</div>
                <div className="text-sm text-gray-400">Support this proposal</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectedVote(0)}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              selectedVote === 0
                ? 'border-red-500 bg-red-500/20'
                : 'border-gray-700 hover:border-red-500/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <ThumbsDown className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-white">Vote Against</div>
                <div className="text-sm text-gray-400">Oppose this proposal</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectedVote(2)}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              selectedVote === 2
                ? 'border-yellow-500 bg-yellow-500/20'
                : 'border-gray-700 hover:border-yellow-500/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Minus className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-white">Abstain</div>
                <div className="text-sm text-gray-400">Count towards quorum only</div>
              </div>
            </div>
          </button>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleVote}
            disabled={selectedVote === null || isPending}
            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Vote'
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-red-900/50 hover:bg-red-950/50"
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  )
}
