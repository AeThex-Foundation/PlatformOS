import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Domain } from '@/types/tld';
import { getUserDomains, updateDomainRecords, renewDomain } from '@/services/tld-api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import Layout from '@/components/Layout';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

const DomainManager = ({ 
  domain, 
  onSave, 
  onClose 
}: { 
  domain: Domain; 
  onSave: (domainId: string, records: Domain['records']) => Promise<void>; 
  onClose: () => void;
}) => {
  const [records, setRecords] = useState(domain.records);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(domain.id, records);
    setIsSaving(false);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecords({ ...records, [e.target.name]: e.target.value });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-slate-950 border-slate-800 animate-fade-in">
        <CardContent className="p-6">
          <h3 className="text-2xl font-bold text-white mb-4">Manage {domain.name}</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="eth" className="text-gray-400">ETH Address</Label>
              <Input id="eth" name="eth" value={records.eth} onChange={handleChange} className="bg-slate-900 border-slate-700" />
            </div>
            <div>
              <Label htmlFor="btc" className="text-gray-400">BTC Address</Label>
              <Input id="btc" name="btc" value={records.btc} onChange={handleChange} className="bg-slate-900 border-slate-700" />
            </div>
            <div>
              <Label htmlFor="sol" className="text-gray-400">SOL Address</Label>
              <Input id="sol" name="sol" value={records.sol} onChange={handleChange} className="bg-slate-900 border-slate-700" />
            </div>
            <div>
              <Label htmlFor="ipfs" className="text-gray-400">IPFS Content Hash</Label>
              <Input id="ipfs" name="ipfs" value={records.ipfs} onChange={handleChange} className="bg-slate-900 border-slate-700" />
            </div>
            <div>
              <Label htmlFor="avatar" className="text-gray-400">Avatar URL</Label>
              <Input id="avatar" name="avatar" value={records.avatar} onChange={handleChange} className="bg-slate-900 border-slate-700" />
            </div>
            <div>
              <Label htmlFor="twitter" className="text-gray-400">Twitter Handle</Label>
              <Input id="twitter" name="twitter" value={records.twitter} onChange={handleChange} placeholder="@username" className="bg-slate-900 border-slate-700" />
            </div>
            <div>
              <Label htmlFor="discord" className="text-gray-400">Discord Handle</Label>
              <Input id="discord" name="discord" value={records.discord} onChange={handleChange} placeholder="username#1234" className="bg-slate-900 border-slate-700" />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-red-500 hover:bg-red-600">
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ExpirationModal = ({ 
  domain, 
  onRenew, 
  onClose 
}: { 
  domain: Domain; 
  onRenew: (domainId: string) => Promise<void>; 
  onClose: () => void;
}) => {
  const [isRenewing, setIsRenewing] = useState(false);
  
  const daysLeft = Math.ceil((domain.expires - Date.now()) / (1000 * 60 * 60 * 24));
  const isExpired = daysLeft < 0;

  const handleRenewClick = async () => {
    setIsRenewing(true);
    await onRenew(domain.id);
    setIsRenewing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card className="w-full max-w-md bg-slate-800 border-2 border-red-500 shadow-red-500/20 shadow-2xl relative">
        <CardContent className="p-6">
          <div className="absolute top-4 right-4">
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Action Required</h3>
            <p className="text-gray-400 mb-6">
              Your domain <span className="font-bold text-amber-400">{domain.name}</span> 
              {isExpired ? " has expired!" : ` is expiring in ${daysLeft} days.`}
              <br/>
              Renew now to keep your decentralized identity.
            </p>
            
            <div className="flex flex-col gap-3">
              <Button onClick={handleRenewClick} disabled={isRenewing} className="bg-red-500 hover:bg-red-600">
                {isRenewing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Renew for 1 Year
              </Button>
              <Button variant="outline" onClick={onClose}>
                Remind Me Later
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TLDDashboard() {
  const { user, profile } = useAuth();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [expiringDomain, setExpiringDomain] = useState<Domain | null>(null);

  const isConnected = !!user;
  const address = profile?.wallet_address || user?.id || '';

  const fetchDomains = useCallback(async () => {
    if (isConnected && address) {
      setIsLoading(true);
      const userDomains = await getUserDomains(address);
      setDomains(userDomains);
      setIsLoading(false);

      setTimeout(() => {
        const EXPIRATION_THRESHOLD = 30 * 24 * 60 * 60 * 1000;
        const expiring = userDomains.find(d => (d.expires - Date.now()) < EXPIRATION_THRESHOLD);
        if (expiring) {
          setExpiringDomain(expiring);
        }
      }, 1000);
    }
  }, [isConnected, address]);

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);
  
  const handleSaveRecords = async (domainId: string, records: Domain['records']) => {
    await updateDomainRecords(domainId, records);
    await fetchDomains();
  };

  const handleRenewDomain = async (domainId: string) => {
    await renewDomain(domainId);
    await fetchDomains();
  }

  if (!isConnected) {
    return (
      <Layout>
        <div className="container mx-auto max-w-6xl px-4 py-12">
          <div className="text-center animate-fade-in">
            <h2 className="text-3xl font-bold text-white">Connect Your Wallet</h2>
            <p className="mt-2 text-gray-400">Please sign in to view and manage your domains.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto max-w-6xl px-4 py-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-6">My Domains</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-slate-900 border-slate-800">
                <CardContent className="p-6 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <Skeleton className="h-6 w-3/5" />
                    </div>
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-10 w-full mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-12 animate-fade-in">
        <h1 className="text-4xl font-bold text-white mb-6">My Domains</h1>
        {domains.length === 0 ? (
          <p className="text-gray-400">You don't own any .aethex domains yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domains.map(domain => (
              <Card key={domain.id} className="bg-slate-900 border-slate-800 flex flex-col justify-between">
                <CardContent className="p-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      {domain.records.avatar && <img src={domain.records.avatar} alt="avatar" className="w-10 h-10 rounded-full" />}
                      <h2 className="text-2xl font-bold text-white">{domain.name}</h2>
                    </div>
                    <p className={`text-sm font-medium ${ (domain.expires - Date.now()) < (30 * 24 * 60 * 60 * 1000) ? 'text-red-400' : 'text-gray-400'}`}>
                      Expires: {new Date(domain.expires).toLocaleDateString()}
                    </p>
                    <div className="mt-4 flex items-center space-x-4">
                      {domain.records.twitter && (
                        <a href={`https://twitter.com/${domain.records.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                          <span className="text-sm">{domain.records.twitter}</span>
                        </a>
                      )}
                      {domain.records.discord && (
                        <div className="flex items-center space-x-1 text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.54 0c1.356 0 2.46 1.104 2.46 2.472v19.056c0 1.368-1.104 2.472-2.46 2.472h-15.08c-1.356 0-2.46-1.104-2.46-2.472v-19.056c0-1.368 1.104-2.472 2.46-2.472h15.08zm-2.883 8.247c-.71-.354-1.419-.53-2.128-.625.176-.265.353-.53.353-.883 0-.53-.264-1.059-.705-1.41-2.29-1.85-5.903-1.41-5.903 1.41 0 .264.088.617.265.882-.71.094-1.419.265-2.128.625-2.82 1.32-2.82 4.673-2.82 4.673s1.233 1.692 3.876 1.692c0 0-1.058-1.146-1.058-2.292 0-1.234 1.146-2.291 1.146-2.291l.176.177c-1.32 1.058-1.762 2.115-1.762 2.115s.352 1.587 3.26 1.587c2.906 0 3.258-1.587 3.258-1.587s-.442-1.057-1.762-2.115l.177-.177c0 0 1.146 1.057 1.146 2.291 0 1.146-1.058 2.292-1.058 2.292 2.643 0 3.876-1.692 3.876-1.692s0-3.353-2.82-4.673zm-6.817-1.41c.53 0 .97-.442.97-.97s-.44-.97-.97-.97c-.53 0-.97.44-.97.97s.44.97.97.97zm3.758 0c.53 0 .97-.442.97-.97s-.44-.97-.97-.97c-.53 0-.97.44-.97.97s.44.97.97.97z"></path></svg>
                          <span className="text-sm">{domain.records.discord}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button className="mt-4 w-full" variant="outline" onClick={() => setSelectedDomain(domain)}>Manage</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {selectedDomain && <DomainManager domain={selectedDomain} onSave={handleSaveRecords} onClose={() => setSelectedDomain(null)} />}
        {expiringDomain && <ExpirationModal domain={expiringDomain} onRenew={handleRenewDomain} onClose={() => setExpiringDomain(null)} />}
      </div>
    </Layout>
  );
}
