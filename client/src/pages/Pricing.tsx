import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowRight, Zap } from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';

export default function Pricing() {
  const { isAuthenticated } = useAuth();

  const features = [
    'Unlimited jobs & customers',
    'AI wrap & sticker designer',
    'Professional invoicing',
    'Team management (up to 5 members)',
    'Client approval portal',
    'Portfolio gallery',
    'Mobile app access',
    'Email support',
    'Design templates',
    'Job tracking & calendar',
  ];

  const enterpriseFeatures = [
    'Everything in Pro',
    'Unlimited team members',
    'Custom branding',
    'Advanced analytics',
    'API access',
    'Priority support',
    'Custom integrations',
    'Dedicated account manager',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="pt-20 pb-12 px-4 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Everything you need to manage your wrap and tint business. No hidden fees. Cancel anytime.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Starter */}
          <Card className="bg-slate-800/50 border-slate-700 hover:border-pink-500/50 transition">
            <CardHeader>
              <CardTitle className="text-2xl">Starter</CardTitle>
              <p className="text-slate-400 mt-2">Perfect for solo operators</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <span className="text-4xl font-bold">$99</span>
                <span className="text-slate-400">/month</span>
              </div>
              <Button className="w-full bg-gradient-to-r from-pink-600 to-cyan-600 hover:from-pink-700 hover:to-cyan-700 text-white font-bold">
                Get Started
              </Button>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>Up to 50 jobs/month</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>1 team member</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>AI design tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>Basic support</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pro (Featured) */}
          <Card className="bg-gradient-to-br from-pink-600/20 to-cyan-600/20 border-pink-500/50 relative md:scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-pink-600 to-cyan-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Most Popular
              </span>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Pro</CardTitle>
              <p className="text-slate-300 mt-2">For growing teams</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <span className="text-4xl font-bold">$299</span>
                <span className="text-slate-400">/month</span>
              </div>
              <Button className="w-full bg-gradient-to-r from-pink-600 to-cyan-600 hover:from-pink-700 hover:to-cyan-700 text-white font-bold">
                Start Free Trial
              </Button>
              <div className="space-y-3">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enterprise */}
          <Card className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition">
            <CardHeader>
              <CardTitle className="text-2xl">Enterprise</CardTitle>
              <p className="text-slate-400 mt-2">For large operations</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <span className="text-4xl font-bold">Custom</span>
                <p className="text-slate-400 text-sm mt-1">Contact for pricing</p>
              </div>
              <Button
                variant="outline"
                className="w-full border-slate-600 hover:bg-slate-700/50 text-white font-bold"
              >
                Contact Sales
              </Button>
              <div className="space-y-3">
                {enterpriseFeatures.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-2">Can I cancel anytime?</h3>
              <p className="text-slate-300">Yes! Cancel your subscription anytime with no penalties. Your data remains accessible for 30 days after cancellation.</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-2">Is there a free trial?</h3>
              <p className="text-slate-300">Yes! Pro plan includes a 14-day free trial. No credit card required to start.</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-2">What payment methods do you accept?</h3>
              <p className="text-slate-300">We accept all major credit cards (Visa, Mastercard, American Express) via Stripe. Invoicing available for Enterprise customers.</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-2">Can I upgrade or downgrade anytime?</h3>
              <p className="text-slate-300">Absolutely! Change your plan anytime. We'll prorate charges based on your billing cycle.</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-2">Do you offer discounts for annual billing?</h3>
              <p className="text-slate-300">Yes! Pay annually and save 20%. Contact our sales team for details.</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-2">What about data security?</h3>
              <p className="text-slate-300">All data is encrypted in transit and at rest. We perform regular security audits and backups. GDPR compliant.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <Card className="bg-gradient-to-r from-pink-600/20 to-cyan-600/20 border-pink-500/50 p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to streamline your business?</h2>
            <p className="text-xl text-slate-300 mb-8">Join 50+ wrap and tint shops already using our CRM.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button className="bg-gradient-to-r from-pink-600 to-cyan-600 hover:from-pink-700 hover:to-cyan-700 text-white font-bold px-8 py-3 flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="border-slate-600 hover:bg-slate-700/50 text-white font-bold px-8 py-3"
              >
                Schedule Demo
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
