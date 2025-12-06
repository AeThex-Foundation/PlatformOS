import { useState } from 'react';
import { checkDomainAvailability, registerDomain } from '@/services/tld-api';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { Loader2 } from 'lucide-react';

const DomainSearchResult = ({ 
  result, 
  onRegister 
}: { 
  result: { available: boolean; price?: number; name: string } | null;
  onRegister: (name: string) => void;
}) => {
  if (!result) return null;
  const { available, price, name } = result;

  return (
    <Card className="mt-6 animate-fade-in bg-slate-900 border-red-500/20">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="text-center sm:text-left">
            <p className="text-xl font-bold text-white">{name}.aethex</p>
            {available ? (
              <p className="text-green-400">is available!</p>
            ) : (
              <p className="text-red-400">is not available.</p>
            )}
          </div>
          {available && price !== undefined && (
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <p className="text-lg font-semibold text-amber-400">{price} ETH</p>
              <Button onClick={() => onRegister(name)} className="bg-red-500 hover:bg-red-600">
                Register
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function TLDHome() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [searchResult, setSearchResult] = useState<{ available: boolean; price?: number, name: string } | null>(null);
  const [message, setMessage] = useState('');
  const { user, profile } = useAuth();

  const isConnected = !!user;
  const address = profile?.wallet_address || user?.id || '';

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) return;
    setIsLoading(true);
    setSearchResult(null);
    setMessage('');
    try {
      const result = await checkDomainAvailability(searchTerm);
      setSearchResult({ ...result, name: searchTerm });
    } catch (error) {
      setMessage('Error checking availability.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (name: string) => {
    if (!isConnected || !address) {
      setMessage('Please sign in to register a domain.');
      return;
    }
    setIsRegistering(true);
    setMessage('');
    try {
      await registerDomain(name, address);
      setMessage(`Successfully registered ${name}.aethex! View it in your dashboard.`);
      setSearchResult(null);
      setSearchTerm('');
    } catch (error) {
      setMessage('Failed to register domain. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="text-center animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
            Your Identity for the <span className="text-red-500">Decentralized Web</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
            Claim your .aethex domain. A single name for all your wallets, websites, and more.
          </p>

          <form onSubmit={handleSearch} className="mt-8 max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-grow w-full">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Find your new identity"
                className="pr-24 bg-slate-900 border-slate-700 focus:border-red-500"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">.aethex</span>
            </div>
            <Button 
              type="submit" 
              disabled={!searchTerm.trim() || isLoading} 
              className="w-full sm:w-auto bg-red-500 hover:bg-red-600"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Search
            </Button>
          </form>

          <div className="mt-8 max-w-xl mx-auto">
            {message && <p className="text-amber-400 mb-4">{message}</p>}
            {isRegistering && <p className="text-amber-400 mb-4">Minting your domain... please confirm in your wallet.</p>}
            {searchResult && <DomainSearchResult result={searchResult} onRegister={handleRegister} />}
          </div>

          <div className="mt-20 text-left max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Why .aethex?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-red-500 mb-2">Unified Identity</h3>
                  <p className="text-gray-400">One name for all your crypto addresses, decentralized websites, and social profiles. Simplify your digital life.</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-red-500 mb-2">Decentralized & Censorship-Resistant</h3>
                  <p className="text-gray-400">Built on a secure blockchain, .aethex domains are owned by you, not a corporation. Your identity can't be taken away.</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-red-500 mb-2">Community Governed</h3>
                  <p className="text-gray-400">The Aethex DAO, powered by .aethex holders, shapes the future of the TLD. Your domain is your vote.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
