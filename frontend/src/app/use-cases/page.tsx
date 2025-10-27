import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/layout/Footer';
import { 
  Sparkles, 
  ArrowRight,
  Users,
  Building2,
  Store,
  Megaphone,
  TrendingUp,
  Clock,
  DollarSign,
  Target,
  Zap,
  BarChart3,
  CheckCircle2,
  Star
} from 'lucide-react';

export default function UseCasesPage() {
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
            <Link href="/use-cases" className="text-sm font-medium text-primary">
              Use Cases
            </Link>
            <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
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
          <Target className="h-3 w-3 mr-1" />
          Success Stories & Use Cases
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Transform Your Content Strategy
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          See how creators, businesses, and agencies are using VIRAL.AI to achieve remarkable results
        </p>
      </section>

      {/* Use Cases Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {/* Content Creators */}
          <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-2xl">Content Creators</CardTitle>
              <CardDescription className="text-base">
                Save 10+ hours per week while increasing engagement by 45%
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm">90% time savings on content creation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm">3x posting frequency across platforms</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm">45% higher engagement rates</span>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm italic text-muted-foreground">
                  "I went from posting 3 times a week to daily content. My follower growth increased by 250%!"
                </p>
                <p className="text-xs font-semibold mt-2">- Sarah M., Lifestyle Creator</p>
              </div>
            </CardContent>
          </Card>

          {/* Social Media Managers */}
          <Card className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
            <CardHeader>
              <Megaphone className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle className="text-2xl">Social Media Managers</CardTitle>
              <CardDescription className="text-base">
                Manage 5x more clients with 30-minute content calendars
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-sm">5x client capacity without hiring</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-sm">Create monthly calendars in 30 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-sm">Maintain brand voice across accounts</span>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm italic text-muted-foreground">
                  "I went from 3 clients to 15 without hiring help. It's like having a content team!"
                </p>
                <p className="text-xs font-semibold mt-2">- Mike R., Freelance SMM</p>
              </div>
            </CardContent>
          </Card>

          {/* Marketing Agencies */}
          <Card className="bg-gradient-to-br from-purple-500/5 to-pink-500/5">
            <CardHeader>
              <Building2 className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle className="text-2xl">Marketing Agencies</CardTitle>
              <CardDescription className="text-base">
                Scale operations by 400% with 80% higher profit margins
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  <span className="text-sm">400% increase in client capacity</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  <span className="text-sm">80% higher profit margins</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  <span className="text-sm">Faster campaign delivery</span>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm italic text-muted-foreground">
                  "We doubled our roster and tripled revenue in 6 months. Transformed our agency!"
                </p>
                <p className="text-xs font-semibold mt-2">- Jessica L., Agency Owner</p>
              </div>
            </CardContent>
          </Card>

          {/* Small Businesses */}
          <Card className="bg-gradient-to-br from-orange-500/5 to-red-500/5">
            <CardHeader>
              <Store className="h-12 w-12 text-orange-600 mb-4" />
              <CardTitle className="text-2xl">Small Businesses</CardTitle>
              <CardDescription className="text-base">
                Professional content at 95% lower cost than agencies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-orange-600 flex-shrink-0" />
                  <span className="text-sm">95% cost reduction vs agencies</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-orange-600 flex-shrink-0" />
                  <span className="text-sm">Enterprise-quality on a budget</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-orange-600 flex-shrink-0" />
                  <span className="text-sm">Compete with big brands</span>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm italic text-muted-foreground">
                  "Enterprise marketing at a price I can afford. Absolute game changer!"
                </p>
                <p className="text-xs font-semibold mt-2">- David K., E-commerce Owner</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Success Metrics */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Real Results</h2>
          <p className="text-xl text-muted-foreground">Numbers that matter</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-5xl font-bold text-primary mb-2">90%</CardTitle>
              <CardDescription className="text-base">Time Saved</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-5xl font-bold text-primary mb-2">3x</CardTitle>
              <CardDescription className="text-base">Content Output</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-5xl font-bold text-primary mb-2">45%</CardTitle>
              <CardDescription className="text-base">Higher Engagement</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-5xl font-bold text-primary mb-2">95%</CardTitle>
              <CardDescription className="text-base">Cost Reduction</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-primary to-purple-600 text-primary-foreground border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-5xl mb-4">
              Ready to Transform Your Content?
            </CardTitle>
            <CardDescription className="text-primary-foreground/80 text-lg">
              Join thousands achieving remarkable results with VIRAL.AI
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="gap-2">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/features">
              <Button size="lg" variant="outline" className="gap-2 bg-transparent text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10">
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
