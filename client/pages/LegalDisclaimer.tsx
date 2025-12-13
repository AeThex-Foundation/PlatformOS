import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, AlertTriangle, Scale, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export default function LegalDisclaimer() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-black via-red-950/10 to-black py-12">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          <header className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Scale className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">
                  Legal Disclaimer
                </h1>
                <p className="text-sm text-muted-foreground">
                  SEC Compliance & Token Governance Disclosure
                </p>
              </div>
            </div>
            <Badge className="bg-amber-600/30 text-amber-200 border border-amber-500/40">
              <Shield className="h-3 w-3 mr-1" />
              Last Updated: December 2024
            </Badge>
          </header>

          <Card className="bg-amber-950/20 border-amber-500/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-400 shrink-0 mt-1" />
                <div className="space-y-2">
                  <h2 className="font-semibold text-white">Important Notice</h2>
                  <p className="text-sm text-gray-300">
                    Please read this disclaimer carefully before participating in any AeThex Foundation 
                    governance activities or acquiring AETHEX tokens. This document explains the legal 
                    nature of our tokens and your rights and responsibilities.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <section className="space-y-3">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-red-400" />
              Token Classification
            </h2>
            <p className="text-sm text-muted-foreground">
              The AETHEX token is a <strong className="text-white">governance utility token</strong>, not a 
              security, investment contract, or financial instrument. It exists solely to enable 
              community participation in Foundation governance decisions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-white">Not a Security or Investment</h2>
            <div className="bg-black/40 rounded-lg border border-red-500/20 p-4 space-y-3">
              <p className="text-sm text-gray-300">
                <strong className="text-red-400">THE AETHEX TOKEN IS NOT AN INVESTMENT.</strong>
              </p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                <li>
                  AETHEX tokens do not represent equity, ownership, shares, or any claim to 
                  profits, revenue, or assets of the AeThex Foundation or any affiliated entity.
                </li>
                <li>
                  Holding AETHEX tokens does not entitle you to dividends, interest, capital 
                  gains, or any form of financial return.
                </li>
                <li>
                  The value of AETHEX tokens may fluctuate or become zero. Any perceived value 
                  is incidental to its governance utility.
                </li>
                <li>
                  We make no promises, representations, or guarantees regarding the future 
                  value of AETHEX tokens.
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-white">No Expectation of Profit</h2>
            <p className="text-sm text-muted-foreground">
              Participants should have <strong className="text-white">no expectation of profit</strong> from 
              holding AETHEX tokens. The tokens are designed for governance participation only:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
              <li>Voting on Foundation proposals and initiatives</li>
              <li>Participating in community governance decisions</li>
              <li>Contributing to the direction of Foundation programs</li>
              <li>Delegating voting power to trusted community members</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-white">Tokens Are Earned, Not Purchased</h2>
            <div className="bg-green-950/20 rounded-lg border border-green-500/30 p-4">
              <p className="text-sm text-gray-300">
                <strong className="text-green-400">AETHEX tokens cannot be purchased.</strong> They are 
                exclusively earned through:
              </p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2 mt-3">
                <li>Active mentorship contributions to Foundation programs</li>
                <li>Completing educational milestones and certifications</li>
                <li>Contributing labor, skills, or resources to Foundation projects</li>
                <li>Long-term community participation and engagement</li>
                <li>Fulfilling specific roles within the Foundation ecosystem</li>
              </ul>
              <p className="text-sm text-gray-400 mt-3">
                The separation between cash donations and token distribution ensures compliance 
                with securities regulations. Donations to our 501(c)(3) nonprofit are tax-deductible 
                charitable gifts with no token consideration.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-white">Governance Utility Only</h2>
            <p className="text-sm text-muted-foreground">
              AETHEX tokens exist solely to facilitate decentralized governance of Foundation 
              programs. Token holders may:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
              <li>Create and vote on governance proposals</li>
              <li>Participate in budget allocation decisions</li>
              <li>Vote on program priorities and initiatives</li>
              <li>Delegate governance power to other community members</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-3">
              Governance participation does not confer any financial benefit, ownership stake, 
              or claim to Foundation assets.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-white">Limitation of Liability</h2>
            <p className="text-sm text-muted-foreground">
              To the maximum extent permitted by applicable law:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
              <li>
                The AeThex Foundation, its directors, officers, employees, and agents shall not 
                be liable for any direct, indirect, incidental, special, consequential, or 
                punitive damages arising from token acquisition, holding, or governance participation.
              </li>
              <li>
                We are not responsible for any loss of tokens due to wallet errors, smart 
                contract bugs, blockchain failures, or user error.
              </li>
              <li>
                Participants assume all risks associated with blockchain technology and 
                decentralized governance.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-white">Regulatory Compliance</h2>
            <p className="text-sm text-muted-foreground">
              The AeThex Foundation strives to comply with all applicable laws and regulations. 
              Token distribution and governance mechanisms are designed to avoid classification 
              as securities under the Howey Test and similar regulatory frameworks.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Participants are responsible for understanding and complying with all laws 
              applicable in their jurisdiction regarding token acquisition and governance 
              participation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-white">Governing Law & Jurisdiction</h2>
            <div className="bg-black/40 rounded-lg border border-gray-500/30 p-4">
              <p className="text-sm text-gray-300">
                This disclaimer and all matters arising from AETHEX token governance shall be 
                governed by and construed in accordance with the laws of the <strong className="text-white">State of Arizona</strong>, 
                United States, without regard to conflict of law principles.
              </p>
              <p className="text-sm text-gray-400 mt-3">
                Any disputes shall be resolved exclusively in the state or federal courts 
                located in Maricopa County, Arizona.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-white">Amendments</h2>
            <p className="text-sm text-muted-foreground">
              The AeThex Foundation reserves the right to modify this disclaimer at any time. 
              Continued participation in governance activities constitutes acceptance of any 
              modifications. Material changes will be communicated through official Foundation 
              channels.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-white">Contact Information</h2>
            <p className="text-sm text-muted-foreground">
              For questions regarding this disclaimer or token governance:
            </p>
            <div className="bg-black/40 rounded-lg border border-gray-500/30 p-4 space-y-2">
              <p className="text-sm text-gray-300">
                <strong>Email:</strong> legal@aethex.org
              </p>
              <p className="text-sm text-gray-300">
                <strong>Organization:</strong> AeThex Foundation, Inc.
              </p>
              <p className="text-sm text-gray-300">
                <strong>Status:</strong> 501(c)(3) Public Charity
              </p>
            </div>
          </section>

          <footer className="pt-8 border-t border-gray-800">
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <span className="text-gray-600">|</span>
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <span className="text-gray-600">|</span>
              <Link to="/donate" className="hover:text-white transition-colors">
                Support the Foundation
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </Layout>
  );
}
