import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/layout/Footer';
import { 
  Sparkles, 
  Check, 
  X,
  ArrowRight,
  Zap,
  Crown,
  Building2,
  Rocket
} from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: 0,
      period: 'forever',
      description: 'Perfect for trying out VIRAL.AI',
      icon: Sparkles,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      features: [
        { name: '5 AI images per month', included: true },
        { name: '10 content generations per month', included: true },
        { name: '3 tracked links', included: true },
        { name: 'Basic keyword research (10/month)', included: true },
        { name: 'Basic analytics', included: true },
        { name: 'Watermark on images', included: true },
        { name: 'Community support', included: true },
        { name: 'Brand guidelines', included: false },
        { name: 'Priority support', included: false },
        { name: 'API access', included: false },
      ],
      cta: 'Get Started',
      ctaVariant: 'outline' as const,
      popular: false,
    },
    {
      name: 'Starter',
      price: 19,
      period: 'month',
      description: 'For individual creators and influencers',
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      features: [
        { name: '30 AI images per month', included: true },
        { name: '100 content generations per month', included: true },
        { name: '25 tracked links', included: true },
        { name: 'Unlimited keyword research', included: true },
        { name: 'Full analytics dashboard', included: true },
        { name: 'No watermarks', included: true },
        { name: 'Brand guidelines support', included: true },
        { name: 'Priority email support', included: true },
        { name: 'Export data', included: true },
        { name: 'API access', included: false },
      ],
      cta: 'Start Free Trial',
      ctaVariant: 'default' as const,
      popular: false,
    },
    {
      name: 'Pro',
      price: 49,
      period: 'month',
      description: 'For professional creators and small businesses',
      icon: Crown,
      color: 'text-primary',
      bgColor: 'bg-primary/5',
      features: [
        { name: '150 AI images per month', included: true },
        { name: '500 content generations per month', included: true },
        { name: '100 tracked links', included: true },
        { name: 'Unlimited keyword research', included: true },
        { name: 'Advanced analytics (device, browser, OS, country)', included: true },
        { name: 'No watermarks', included: true },
        { name: 'Custom brand colors & styles', included: true },
        { name: 'Bulk content generation', included: true },
        { name: 'API access (basic)', included: true },
        { name: 'Priority email support', included: true },
      ],
      cta: 'Start Free Trial',
      ctaVariant: 'default' as const,
      popular: true,
    },
    {
      name: 'Business',
      price: 149,
      period: 'month',
      description: 'For marketing agencies and growing businesses',
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      features: [
        { name: '500 AI images per month', included: true },
        { name: '2,000 content generations per month', included: true },
        { name: 'Unlimited tracked links', included: true },
        { name: 'Unlimited keyword research', included: true },
        { name: 'Advanced analytics & reporting', included: true },
        { name: 'Team collaboration (5 users)', included: true },
        { name: 'White-label options', included: true },
        { name: 'Advanced API access', included: true },
        { name: 'Custom integrations', included: true },
        { name: 'Dedicated account manager', included: true },
      ],
      cta: 'Start Free Trial',
      ctaVariant: 'default' as const,
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-2xl font-bold">VIRAL.AI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="/use-cases" className="text-sm font-medium hover:text-primary transition-colors">
              Use Cases
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-primary">
              Pricing
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-4" variant="secondary">
          <Rocket className="h-3 w-3 mr-1" />
          Simple, Transparent Pricing
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Choose Your Plan
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Start free, upgrade as you grow. All plans include a 14-day free trial with no credit card required.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            <span>14-day free trial</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 py-12 mb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card 
                key={plan.name} 
                className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${plan.bgColor} mb-4 mx-auto`}>
                    <Icon className={`h-6 w-6 ${plan.color}`} />
                  </div>
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-sm mb-4">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <Link href="/register" className="block">
                    <Button 
                      variant={plan.ctaVariant} 
                      className="w-full"
                      size="lg"
                    >
                      {plan.cta}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>

                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm ${feature.included ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Annual Billing Note */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-2">
            💰 <strong>Save 20%</strong> with annual billing
          </p>
          <p className="text-sm text-muted-foreground">
            Annual plans: Starter $190/year • Pro $490/year • Business $1,490/year
          </p>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-primary to-purple-600 text-primary-foreground border-0">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-foreground/10 mb-4 mx-auto">
              <Rocket className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl md:text-4xl mb-4">
              Need More? Go Enterprise
            </CardTitle>
            <CardDescription className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              Custom solutions for large organizations with unlimited usage, dedicated support, and enterprise-grade features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <h3 className="font-semibold mb-2">Unlimited Everything</h3>
                <p className="text-sm text-primary-foreground/80">
                  No limits on content, images, or tracked links
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-2">Dedicated Support</h3>
                <p className="text-sm text-primary-foreground/80">
                  24/7 premium support with SLA guarantees
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-2">Custom Solutions</h3>
                <p className="text-sm text-primary-foreground/80">
                  Tailored features and integrations for your needs
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <Link href="mailto:john@ai-it.io?subject=Enterprise%20Plan%20Inquiry">
                <Button size="lg" variant="secondary" className="gap-2">
                  Contact Sales <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about our pricing
          </p>
        </div>

        <div className="max-w-3xl mx-auto grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>What happens after my free trial ends?</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              After your 14-day free trial, you'll be automatically downgraded to the Free plan. You can upgrade to a paid plan anytime to continue enjoying premium features.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Can I change plans later?</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What payment methods do you accept?</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. Enterprise customers can also pay via invoice.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What happens if I exceed my monthly limits?</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              You'll receive a notification when you're approaching your limit. Once exceeded, you can either upgrade your plan or wait until next month when your limits reset.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Is there a money-back guarantee?</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Yes! We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, contact us for a full refund.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Do you offer discounts for nonprofits or students?</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Yes! We offer special discounts for nonprofits, educational institutions, and students. Contact us at john@ai-it.io with proof of eligibility.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl mb-4">
              Ready to Go Viral?
            </CardTitle>
            <CardDescription className="text-white/80 text-lg">
              Start your free trial today. No credit card required.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="gap-2">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/features">
              <Button size="lg" variant="outline" className="gap-2 bg-transparent text-white border-white/20 hover:bg-white/10">
                Explore Features
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
}
