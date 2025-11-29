import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Shield, 
  Wallet, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ExternalLink,
  Copy,
  Globe,
  AlertTriangle,
  Coins
} from "lucide-react";
import { WalletConnect } from "@/components/WalletConnect";
import { toast } from "sonner";

interface DomainInfo {
  domain: string | null;
  walletAddress: string | null;
}

interface TokenBalance {
  balance: string;
  hasMinimumBalance: boolean;
  minimumRequired: string;
}

export default function Passport() {
  const { user } = useAuth();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const navigate = useNavigate();

  const [subdomain, setSubdomain] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [availability, setAvailability] = useState<{ available: boolean; error?: string } | null>(null);
  const [myDomain, setMyDomain] = useState<DomainInfo | null>(null);
  const [tokenBalance, setTokenBalance] = useState<TokenBalance | null>(null);
  const [isLoadingDomain, setIsLoadingDomain] = useState(true);

  const POLYGON_CHAIN_ID = 137;
  const isOnPolygon = chainId === POLYGON_CHAIN_ID;

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/hub/passport");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      fetchMyDomain();
    }
  }, [user]);

  useEffect(() => {
    if (isConnected && address) {
      fetchTokenBalance(address);
    }
  }, [isConnected, address]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (subdomain.length >= 3) {
        checkAvailability();
      } else {
        setAvailability(null);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [subdomain]);

  const fetchMyDomain = async () => {
    try {
      const response = await fetch("/api/domains/my-domain", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setMyDomain(data);
      }
    } catch (error) {
      console.error("Failed to fetch domain:", error);
    } finally {
      setIsLoadingDomain(false);
    }
  };

  const fetchTokenBalance = async (walletAddress: string) => {
    try {
      const response = await fetch(`/api/domains/balance/${walletAddress}`);
      if (response.ok) {
        const data = await response.json();
        setTokenBalance(data);
      }
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  };

  const checkAvailability = async () => {
    if (!subdomain || subdomain.length < 3) return;

    setIsChecking(true);
    try {
      const response = await fetch(`/api/domains/check/${subdomain.toLowerCase()}`);
      const data = await response.json();
      setAvailability(data);
    } catch (error) {
      setAvailability({ available: false, error: "Failed to check availability" });
    } finally {
      setIsChecking(false);
    }
  };

  const handleClaim = async () => {
    if (!subdomain || !address || !availability?.available) return;

    setIsClaiming(true);
    try {
      const response = await fetch("/api/domains/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          subdomain: subdomain.toLowerCase(),
          walletAddress: address,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Successfully claimed ${data.domain}!`);
        setMyDomain({ domain: data.domain, walletAddress: address });
        setSubdomain("");
        setAvailability(null);
      } else {
        toast.error(data.error || "Failed to claim domain");
      }
    } catch (error) {
      toast.error("Failed to claim domain");
    } finally {
      setIsClaiming(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <SEO
        pageTitle="AeThex Passport"
        description="Claim your .aethex domain - your on-chain identity across the AeThex ecosystem."
      />
      <Layout>
        <div className="container mx-auto px-4 py-16 space-y-12">
          <section className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-red-500/50 text-red-500">
                    AeThex Passport
                  </Badge>
                </div>
                <h1 className="text-4xl font-bold">
                  <span className="bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
                    Your .aethex Identity
                  </span>
                </h1>
                <p className="text-xl text-gray-400 max-w-3xl">
                  Claim your unique .aethex domain - a human-readable identity that works across the entire AeThex ecosystem.
                </p>
              </div>
              <WalletConnect />
            </div>
          </section>

          {myDomain?.domain ? (
            <Card className="border-green-500/30 bg-gradient-to-br from-green-950/20 to-black/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-green-400">Your Passport Domain</CardTitle>
                    <CardDescription>You've claimed your .aethex identity</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-3">
                    <Globe className="h-6 w-6 text-yellow-500" />
                    <span className="text-2xl font-bold text-white font-mono">
                      {myDomain.domain}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(myDomain.domain!)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                {myDomain.walletAddress && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Wallet className="h-4 w-4" />
                    <span>Linked to:</span>
                    <code className="font-mono text-gray-300">
                      {myDomain.walletAddress.slice(0, 6)}...{myDomain.walletAddress.slice(-4)}
                    </code>
                    <a
                      href={`https://polygonscan.com/address/${myDomain.walletAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-400 hover:text-red-300"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                <div className="p-4 bg-yellow-950/20 rounded-lg border border-yellow-500/20">
                  <p className="text-sm text-yellow-200">
                    Your domain is now active! It will be displayed on your profile and can be used to receive payments across supported wallets.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="border-red-900/30 bg-gradient-to-br from-red-950/20 to-black/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-400" />
                    Claim Your Domain
                  </CardTitle>
                  <CardDescription>
                    Choose a unique subdomain for your .aethex identity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!isOnPolygon && isConnected && (
                    <div className="p-4 bg-yellow-950/20 rounded-lg border border-yellow-500/30">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        <div className="flex-1">
                          <p className="text-yellow-200 font-medium">Wrong Network</p>
                          <p className="text-sm text-yellow-400/70">
                            Please switch to Polygon to claim your domain.
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-yellow-500/50 text-yellow-300"
                          onClick={() => switchChain?.({ chainId: POLYGON_CHAIN_ID })}
                        >
                          Switch
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="subdomain">Choose your subdomain</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="subdomain"
                        placeholder="yourname"
                        value={subdomain}
                        onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                        className="font-mono bg-black/30 border-red-900/30"
                        disabled={!isConnected}
                      />
                      <span className="text-gray-400 font-mono">.aethex</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      3-63 characters, lowercase letters, numbers, and hyphens only
                    </p>
                  </div>

                  {subdomain.length >= 3 && (
                    <div className="flex items-center gap-2">
                      {isChecking ? (
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      ) : availability?.available ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm ${availability?.available ? "text-green-400" : "text-red-400"}`}>
                        {isChecking
                          ? "Checking..."
                          : availability?.available
                          ? `${subdomain}.aethex is available!`
                          : availability?.error || `${subdomain}.aethex is not available`}
                      </span>
                    </div>
                  )}

                  {!isConnected ? (
                    <div className="p-4 bg-red-950/20 rounded-lg border border-red-500/20 text-center">
                      <p className="text-gray-400 mb-3">Connect your wallet to claim a domain</p>
                      <WalletConnect />
                    </div>
                  ) : (
                    <Button
                      onClick={handleClaim}
                      disabled={!availability?.available || isClaiming || !isOnPolygon || !tokenBalance?.hasMinimumBalance}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                    >
                      {isClaiming ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Claiming...
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          Claim {subdomain}.aethex
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="border-yellow-900/30 bg-gradient-to-br from-yellow-950/10 to-black/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-400">
                      <Coins className="h-5 w-5" />
                      Token Requirement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-400">
                      To claim a .aethex domain, you must hold at least 1 $AETHEX token on Polygon.
                    </p>

                    {isConnected && tokenBalance && (
                      <div className="p-4 bg-black/30 rounded-lg border border-yellow-500/20">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Your Balance:</span>
                          <span className={`font-mono font-bold ${tokenBalance.hasMinimumBalance ? "text-green-400" : "text-red-400"}`}>
                            {parseFloat(tokenBalance.balance).toFixed(2)} AETHEX
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-gray-400">Required:</span>
                          <span className="font-mono text-gray-300">
                            {tokenBalance.minimumRequired} AETHEX
                          </span>
                        </div>
                        {!tokenBalance.hasMinimumBalance && (
                          <p className="text-sm text-red-400 mt-3">
                            You need to acquire $AETHEX tokens to claim a domain.
                          </p>
                        )}
                      </div>
                    )}

                    <Button
                      variant="outline"
                      className="w-full border-yellow-500/30 text-yellow-400 hover:bg-yellow-950/30"
                      asChild
                    >
                      <a
                        href={`https://polygonscan.com/token/0xf846380e25b34B71474543fdB28258F8477E2Cf1`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View $AETHEX on Polygonscan
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-red-900/30 bg-gradient-to-br from-red-950/10 to-black/20">
                  <CardHeader>
                    <CardTitle className="text-lg">How it works</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-3 text-sm text-gray-400">
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-bold">1</span>
                        <span>Connect your wallet and ensure you have $AETHEX tokens</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-bold">2</span>
                        <span>Choose a unique subdomain for your identity</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-bold">3</span>
                        <span>Claim your domain - it's linked to your Passport profile</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-bold">4</span>
                        <span>Use your .aethex domain across the entire ecosystem</span>
                      </li>
                    </ol>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}
