import { useState } from 'react'
import { useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Card } from '../ui/card'
import { Plus, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { useToast } from '../../hooks/use-toast'
import { GOVERNOR_ADDRESS } from '../../lib/wagmi'
import { GOVERNOR_ABI } from '../../lib/contracts'

export function CreateProposal({ onClose }: { onClose?: () => void }) {
  const { isConnected } = useAccount()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { toast } = useToast()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !description) return

    try {
      const fullDescription = `# ${title}\n\n${description}`
      
      writeContract({
        address: GOVERNOR_ADDRESS,
        abi: GOVERNOR_ABI,
        functionName: 'propose',
        args: [
          [], // targets (empty for now - can add treasury actions later)
          [], // values
          [], // calldatas
          fullDescription,
        ],
      } as any, {
        onSuccess: () => {
          toast({
            title: "Proposal Submitted",
            description: "Your proposal is being created on-chain...",
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
        description: error.message || "Failed to create proposal",
        variant: "destructive",
      })
    }
  }

  if (isSuccess) {
    return (
      <Card className="p-8 text-center border-red-900/30 bg-red-950/20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Proposal Created!</h3>
            <p className="text-gray-400 mb-4">Your proposal has been submitted to the DAO.</p>
            <Button onClick={onClose} className="bg-gradient-to-r from-red-600 to-red-700">
              Back to Proposals
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  if (!isConnected) {
    return (
      <Card className="p-8 text-center border-red-900/30 bg-red-950/20">
        <p className="text-gray-400">Connect your wallet to create a proposal</p>
      </Card>
    )
  }

  return (
    <Card className="p-6 border-red-900/30 bg-red-950/20">
      <h3 className="text-xl font-semibold text-white mb-6">Create New Proposal</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Proposal Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Allocate 10 ETH to Marketing"
            className="bg-black/30 border-red-900/50 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain your proposal in detail..."
            rows={6}
            className="bg-black/30 border-red-900/50 text-white resize-none"
            required
          />
          <p className="text-xs text-gray-500 mt-2">
            Supports Markdown formatting
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isPending || !title || !description}
            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Create Proposal
              </>
            )}
          </Button>
          {onClose && (
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-red-900/50 hover:bg-red-950/50"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}
