'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/layout/Footer';
import { paymentsAPI } from '@/lib/api';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import {
  Sparkles,
  Check,
  X,
  ArrowRight,
  Zap,
  Crown,
  Building2,
  Rocket,
  Loader2,
  TrendingUp,
  Clock
} from 'lucide-react';

interface PlanData {
  name: string;
  regular_price_monthly: number;
  regular_price_yearly: number;
  founder_price_monthly: number;
  founder_price_yearly: number;
  price_id_monthly: string;
  price_id_yearly: string;
  founder_discount_available: boolean;
  founder_slots_remaining: number;
  trial_days: number;
}

interface PricingConfig {
  publishableKey: string;
  plans: {
    creator: PlanData;
    pro: PlanData;
    business: PlanData;
  };
  trial_days: number;
}

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [pricingData, setPricingData] = useState<PricingConfig | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const { isAuthenticated, user, loadUser } = useAuthStore();

  // Load user from localStorage on mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Fetch pricing data on mount
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await paymentsAPI.getPricingConfig();
        setPricingData(response.data);
      } catch (error) {
        console.error('Failed to fetch pricing:', error);
        toast.error('Failed to load pricing. Please refresh the page.');
      }
    };

    fetchPricing();

    // Refresh pricing every 30 seconds to update slots remaining
    const interval = setInterval(fetchPricing, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = async (planId: string) => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      // Redirect to register with plan pre-selected
      router.push(`/register?plan=${planId}`);
      return;
    }

    setLoading(planId);

    try {
      const plan = pricingData?.plans[planId as keyof typeof pricingData.plans];
      const useFounderPricing = plan?.founder_discount_available || false;

      const response = await paymentsAPI.createCheckoutSession({
        plan: planId,
        billing_period: billingPeriod,
        use_founder_pricing: useFounderPricing
      });

      // Redirect to Stripe Checkout
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.error || 'Failed to start checkout');
      setLoading(null);
    }
  };

  const getTierLevel = (tier: string): number => {
    const levels: Record<string, number> = {
      'free': 0,
      'creator': 1,
      'pro': 2,
      'business': 3,
      'agency': 3, // alias for business
    };
    return levels[tier.toLowerCase()] || 0;
  };

  const planDetails = {
    creator: {
      name: 'Creator',
      description: 'Perfect for individual creators and influencers',
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      popular: false,
      features: [
        '50 AI images per month',
        '150 content generations',
        '50 tracked links',
        'Full analytics dashboard',
        'Email support',
      ],
    },
    pro: {
      name: 'Pro',
      description: 'For serious creators and small agencies',
      icon: Crown,
      color: 'text-primary',
      bgColor: 'bg-primary/5',
      popular: true,
      features: [
        '200 AI images per month',
        '750 content generations',
        '300 tracked links',
        'Advanced analytics',
        'API access',
        'Priority support',
      ],
    },
    business: {
      name: 'Business',
      description: 'For agencies and marketing teams',
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      popular: false,
      features: [
        '600 AI images per month',
        '2,500 content generations',
        'Unlimited tracked links',
        'Team features (10 users)',
        'White label ready',
        'Dedicated support',
      ],
    },
  };

  if (!pricingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const hasAnyFounderDiscount = Object.values(pricingData.plans).some(p => p.founder_discount_available);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted">
      {/* Navigation Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-2xl font-bold">VIRAL.AI</span>
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                <Badge variant="secondary" className="capitalize">
                  {user.subscription_tier} Plan
                </Badge>
                <Link href="/dashboard">
                  <Button size="sm">Dashboard</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                  Login
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* Founder Discount Banner */}
        {hasAnyFounderDiscount && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-2 border-primary/20 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Rocket className="h-5 w-5 text-primary" />
                <span className="text-lg font-bold text-primary">🎉 FOUNDER'S LAUNCH SPECIAL</span>
                <Rocket className="h-5 w-5 text-primary" />
              </div>
              <p className="text-muted-foreground mb-2">
                Be one of our first 100 customers and lock in <strong>founder pricing forever</strong>
              </p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <Badge variant="secondary" className="gap-1">
                  <Clock className="h-3 w-3" />
                  Limited Time Only
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Price Locked for Life
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Start with a 14-day free trial. No credit card required. Cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-2 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 rounded-md transition-colors ${billingPeriod === 'monthly'
                ? 'bg-background shadow-sm font-medium'
                : 'text-muted-foreground'
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-4 py-2 rounded-md transition-colors ${billingPeriod === 'yearly'
                ? 'bg-background shadow-sm font-medium'
                : 'text-muted-foreground'
                }`}
            >
              Yearly
              <Badge variant="secondary" className="ml-2">Save 17%</Badge>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 mb-16">
          {(['creator', 'pro', 'business'] as const).map((planId) => {
            const plan = pricingData.plans[planId];
            const details = planDetails[planId];
            const Icon = details.icon;

            const currentPrice = billingPeriod === 'monthly'
              ? (plan.founder_discount_available ? plan.founder_price_monthly : plan.regular_price_monthly)
              : (plan.founder_discount_available ? plan.founder_price_yearly : plan.regular_price_yearly);

            const regularPrice = billingPeriod === 'monthly'
              ? plan.regular_price_monthly
              : plan.regular_price_yearly;

            return (
              <Card
                key={planId}
                className={`relative ${details.popular ? 'border-primary shadow-lg scale-105' : ''
                  }`}
              >
                {details.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary">Most Popular</Badge>
                  </div>
                )}

                {plan.founder_discount_available && (
                  <div className="absolute -top-4 right-4">
                    <Badge variant="destructive" className="animate-pulse">
                      🔥 {plan.founder_slots_remaining} slots left
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${details.bgColor} mb-4 mx-auto`}>
                    <Icon className={`h-6 w-6 ${details.color}`} />
                  </div>
                  <CardTitle className="text-2xl">{details.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {details.description}
                  </CardDescription>

                  <div className="mt-6">
                    {plan.founder_discount_available && (
                      <div className="mb-2">
                        <span className="text-lg line-through text-muted-foreground">
                          ${regularPrice}
                        </span>
                      </div>
                    )}
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">${currentPrice}</span>
                      <span className="text-muted-foreground">
                        /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                      </span>
                    </div>
                    {plan.founder_discount_available && (
                      <Badge variant="secondary" className="mt-2">
                        Save ${regularPrice - currentPrice}/{billingPeriod === 'monthly' ? 'mo' : 'yr'} forever
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2 mb-6">
                    {details.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => handleSubscribe(planId)}
                    disabled={loading !== null || (isAuthenticated && user?.subscription_tier === planId)}
                    className="w-full"
                    variant={details.popular ? 'default' : 'outline'}
                  >
                    {loading === planId ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : isAuthenticated && user?.subscription_tier === planId ? (
                      'Current Plan'
                    ) : isAuthenticated && user ? (
                      <>
                        {getTierLevel(user.subscription_tier) < getTierLevel(planId) ? 'Upgrade Plan' : 'Downgrade Plan'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        {plan.founder_discount_available
                          ? 'Claim Founder Pricing'
                          : 'Start 14-Day Free Trial'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    14-day free trial • No credit card required
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What is founder pricing?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our first 100 customers get special lifetime discounted pricing that never increases.
                  This is our way of rewarding early adopters who believe in our vision.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What happens after the free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  After 14 days, you'll be charged your selected plan rate. You can cancel anytime
                  before the trial ends with no charges.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change plans later?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! You can upgrade or downgrade your plan anytime from your dashboard. If you have
                  founder pricing, you'll keep the discount when upgrading.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We accept all major credit cards (Visa, Mastercard, American Express) and debit cards
                  through Stripe's secure payment processing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
