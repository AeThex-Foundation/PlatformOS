import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { GrantApplication } from '@/types/tld';
import { submitGrantApplication, getUserGrants } from '@/services/tld-api';
import Layout from '@/components/Layout';
import { Loader2 } from 'lucide-react';

type GrantFormData = {
  projectName: string;
  teamDetails: string;
  projectDescription: string;
  fundingAmount: number;
};

const ApplyGrantForm = ({ onSuccessfulSubmit }: { onSuccessfulSubmit: () => void }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<GrantFormData>();
  const { user, profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const isConnected = !!user;
  const address = profile?.wallet_address || user?.id || '';

  const onSubmit = async (data: GrantFormData) => {
    if (!isConnected || !address) {
      setSubmitMessage('Please sign in to submit an application.');
      return;
    }
    setIsSubmitting(true);
    setSubmitMessage('');
    try {
      await submitGrantApplication({ ...data, applicantAddress: address });
      setSubmitMessage('Your grant application has been submitted successfully!');
      reset();
      onSuccessfulSubmit();
    } catch (error) {
      setSubmitMessage('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Submit Your Proposal</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="projectName" className="text-gray-400">Project Name</Label>
            <Input 
              id="projectName" 
              {...register('projectName', { required: true })} 
              className="bg-slate-950 border-slate-700"
            />
            {errors.projectName && <span className="text-red-400 text-sm">This field is required</span>}
          </div>
          
          <div>
            <Label htmlFor="teamDetails" className="text-gray-400">Team Details</Label>
            <Textarea 
              id="teamDetails" 
              {...register('teamDetails', { required: true })} 
              className="bg-slate-950 border-slate-700 min-h-[80px]"
            />
            {errors.teamDetails && <span className="text-red-400 text-sm">This field is required</span>}
          </div>

          <div>
            <Label htmlFor="projectDescription" className="text-gray-400">Project Description</Label>
            <Textarea 
              id="projectDescription" 
              {...register('projectDescription', { required: true })} 
              className="bg-slate-950 border-slate-700 min-h-[100px]"
            />
            {errors.projectDescription && <span className="text-red-400 text-sm">This field is required</span>}
          </div>

          <div>
            <Label htmlFor="fundingAmount" className="text-gray-400">Funding Amount (USDC)</Label>
            <Input 
              id="fundingAmount" 
              type="number" 
              {...register('fundingAmount', { required: true, valueAsNumber: true, min: 1 })} 
              className="bg-slate-950 border-slate-700"
            />
            {errors.fundingAmount && <span className="text-red-400 text-sm">Please enter a valid amount</span>}
          </div>

          <Button type="submit" disabled={isSubmitting || !isConnected} className="bg-red-500 hover:bg-red-600">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isConnected ? 'Submit Application' : 'Sign In to Apply'}
          </Button>
          {submitMessage && <p className="text-amber-400 mt-4">{submitMessage}</p>}
        </form>
      </CardContent>
    </Card>
  );
};

const MyGrants = ({ grants }: { grants: GrantApplication[] }) => {
  return (
    <Card className="mt-12 bg-slate-900 border-slate-800">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-white mb-4">My Applications</h2>
        {grants.length === 0 ? (
          <p className="text-gray-400">You haven't submitted any grant applications.</p>
        ) : (
          <div className="space-y-4">
            {grants.map(grant => (
              <div key={grant.id} className="p-4 rounded-md bg-slate-950 flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">{grant.projectName}</p>
                  <p className="text-sm text-gray-400">Requested: ${grant.fundingAmount.toLocaleString()} USDC</p>
                </div>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  grant.status === 'Approved' ? 'bg-green-500/20 text-green-400' : 
                  grant.status === 'Rejected' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                }`}>{grant.status}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function GrantsPage() {
  const { user, profile } = useAuth();
  const [myGrants, setMyGrants] = useState<GrantApplication[]>([]);
  
  const isConnected = !!user;
  const address = profile?.wallet_address || user?.id || '';

  const fetchMyGrants = useCallback(async () => {
    if (isConnected && address) {
      const userGrants = await getUserGrants(address);
      setMyGrants(userGrants);
    }
  }, [isConnected, address]);

  useEffect(() => {
    fetchMyGrants();
  }, [fetchMyGrants]);

  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-12 animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white">Developer Grant Program</h1>
          <p className="mt-2 max-w-3xl mx-auto text-gray-400">
            Help us build the future of the decentralized web. We're funding innovative projects that expand the .aethex ecosystem.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Focus Areas & Funding</h2>
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <ul className="space-y-4 text-white">
                  <li><strong className="text-red-500">Wallet Integrations:</strong> Add .aethex support to existing wallets.</li>
                  <li><strong className="text-red-500">dApp Tooling:</strong> Libraries and frameworks for .aethex-native dApps.</li>
                  <li><strong className="text-red-500">Community & Education:</strong> Create resources to grow our community.</li>
                </ul>
                <div className="mt-6 pt-6 border-t border-red-500/20 space-y-4 text-gray-400">
                  <p><strong className="text-amber-400">Level 1:</strong> Up to $10,000 USDC for smaller projects and proofs-of-concept.</p>
                  <p><strong className="text-amber-400">Level 2:</strong> Up to $30,000 USDC for more established teams and complex projects.</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <ApplyGrantForm onSuccessfulSubmit={fetchMyGrants} />
        </div>
        {isConnected && <MyGrants grants={myGrants} />}
      </div>
    </Layout>
  );
}
