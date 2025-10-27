import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/layout/Footer';
import { 
  Sparkles, 
  Search, 
  Image as ImageIcon, 
  Video, 
  BarChart3, 
  Zap,
  Check,
  ArrowRight,
  Target,
  TrendingUp,
  Clock,
  Globe,
  Palette,
  Link2,
  FileText,
  Brain,
  Rocket
} from 'lucide-react';

export default function FeaturesPage() {
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
            <Link href="/features" className="text-sm font-medium text-primary">
              Features
            </Link>
            <Link href="/use-cases" className="text-sm font-medium hover:text-primary transition-colors">
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
          <Zap className="h-3 w-3 mr-1" />
          Powered by Latest AI Models
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Features That Drive Results
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Everything you need to create, optimize, and track viral content across all major social media platforms.
        </p>
      </section>

      {/* Main Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="space-y-32">
          {/* Keyword Research */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4" variant="outline">
                <Search className="h-3 w-3 mr-1" />
                Keyword Research
              </Badge>
              <h2 className="text-4xl font-bold mb-6">Discover What's Trending</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our advanced AI analyzes millions of data points across social media platforms to identify 
                trending topics, viral keywords, and content opportunities in real-time.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Real-Time Trend Analysis</h3>
                    <p className="text-muted-foreground">
                      Get instant insights into what's trending right now across all platforms
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Niche-Specific Keywords</h3>
                    <p className="text-muted-foreground">
                      Find keywords tailored to your industry and target audience
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Competition Analysis</h3>
                    <p className="text-muted-foreground">
                      See keyword difficulty and opportunity scores to maximize your reach
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-purple-500/5">
              <div className="aspect-square flex items-center justify-center overflow-hidden relative">
                <img 
                  src="/images/features/keyword-research.png" 
                  alt="Keyword Research Illustration"
                  className="w-full h-full object-contain"
                />
              </div>
            </Card>
          </div>

          {/* AI Content Generation */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Card className="p-8 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 order-2 lg:order-1">
              <div className="aspect-square flex items-center justify-center overflow-hidden relative">
                <img 
                  src="/images/features/content-generation.png" 
                  alt="AI Content Generation Illustration"
                  className="w-full h-full object-contain"
                />
              </div>
            </Card>
            <div className="order-1 lg:order-2">
              <Badge className="mb-4" variant="outline">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Content Generation
              </Badge>
              <h2 className="text-4xl font-bold mb-6">Create Platform-Perfect Content</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Generate engaging, platform-optimized content in seconds using the latest AI models. 
                Each piece is crafted to match platform best practices and audience expectations.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-blue-500/10 p-2">
                    <Globe className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Multi-Platform Support</h3>
                    <p className="text-muted-foreground">
                      Instagram, TikTok, LinkedIn, YouTube, Facebook, and Twitter/X
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-blue-500/10 p-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Multiple Content Types</h3>
                    <p className="text-muted-foreground">
                      Captions, scripts, hooks, CTAs, and complete post packages
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-blue-500/10 p-2">
                    <Palette className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Brand Voice Customization</h3>
                    <p className="text-muted-foreground">
                      Add your brand guidelines to ensure consistent messaging
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Image Generation */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4" variant="outline">
                <ImageIcon className="h-3 w-3 mr-1" />
                AI Image Generation
              </Badge>
              <h2 className="text-4xl font-bold mb-6">Stunning Visuals in Seconds</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Create eye-catching, professional-quality images that stop the scroll. 
                Our AI generates platform-optimized visuals that perfectly complement your content.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-purple-500/10 p-2">
                    <Zap className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Instant Generation</h3>
                    <p className="text-muted-foreground">
                      Generate multiple image variations in seconds, not hours
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-purple-500/10 p-2">
                    <Palette className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Style Consistency</h3>
                    <p className="text-muted-foreground">
                      Maintain your brand aesthetic across all generated images
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-purple-500/10 p-2">
                    <Target className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Platform-Optimized</h3>
                    <p className="text-muted-foreground">
                      Perfect dimensions and formats for each social media platform
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Card className="p-8 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
              <div className="aspect-square flex items-center justify-center overflow-hidden relative">
                <img 
                  src="/images/features/image-generation.png" 
                  alt="AI Image Generation Illustration"
                  className="w-full h-full object-contain"
                />
              </div>
            </Card>
          </div>

          {/* Link Tracking */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Card className="p-8 bg-gradient-to-br from-green-500/5 to-emerald-500/5 order-2 lg:order-1">
              <div className="aspect-square flex items-center justify-center overflow-hidden relative">
                <img 
                  src="/images/features/link-tracking.png" 
                  alt="Link Tracking Illustration"
                  className="w-full h-full object-contain"
                />
              </div>
            </Card>
            <div className="order-1 lg:order-2">
              <Badge className="mb-4" variant="outline">
                <Link2 className="h-3 w-3 mr-1" />
                Link Tracking
              </Badge>
              <h2 className="text-4xl font-bold mb-6">Track Every Click</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Create trackable short links and monitor performance with detailed analytics. 
                Understand your audience and optimize your content strategy with real data.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-green-500/10 p-2">
                    <BarChart3 className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Detailed Analytics</h3>
                    <p className="text-muted-foreground">
                      Track clicks, devices, browsers, locations, and more
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-green-500/10 p-2">
                    <Target className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Custom Short Links</h3>
                    <p className="text-muted-foreground">
                      Create branded short links with custom slugs
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-green-500/10 p-2">
                    <Clock className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Real-Time Tracking</h3>
                    <p className="text-muted-foreground">
                      Monitor link performance as it happens
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Dashboard */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4" variant="outline">
                <BarChart3 className="h-3 w-3 mr-1" />
                Analytics Dashboard
              </Badge>
              <h2 className="text-4xl font-bold mb-6">Data-Driven Decisions</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Get actionable insights from comprehensive analytics. Track content performance, 
                link clicks, and audience behavior to continuously improve your strategy.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-orange-500/10 p-2">
                    <TrendingUp className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Performance Metrics</h3>
                    <p className="text-muted-foreground">
                      Track engagement, reach, and conversion across all content
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-orange-500/10 p-2">
                    <Globe className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Audience Insights</h3>
                    <p className="text-muted-foreground">
                      Understand who's engaging with your content and where they're from
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-orange-500/10 p-2">
                    <Rocket className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Growth Tracking</h3>
                    <p className="text-muted-foreground">
                      Monitor your progress and identify what's working
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Card className="p-8 bg-gradient-to-br from-orange-500/5 to-red-500/5">
              <div className="aspect-square flex items-center justify-center overflow-hidden relative">
                <img 
                  src="/images/features/analytics-dashboard.png" 
                  alt="Analytics Dashboard Illustration"
                  className="w-full h-full object-contain"
                />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose VIRAL.AI */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose VIRAL.AI?</h2>
          <p className="text-xl text-muted-foreground">
            The complete content creation solution
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Clock className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Save Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Create a week's worth of content in minutes, not hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Latest AI Technology</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Powered by cutting-edge AI models for best-in-class results
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Target className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Platform-Optimized</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Content tailored for each platform's unique requirements
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Data-Driven</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Make informed decisions with comprehensive analytics
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-primary to-purple-600 text-primary-foreground border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-5xl mb-4">
              Ready to Create Viral Content?
            </CardTitle>
            <CardDescription className="text-primary-foreground/80 text-lg">
              Join thousands of creators using AI to dominate social media
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="gap-2">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/use-cases">
              <Button size="lg" variant="outline" className="gap-2 bg-transparent text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10">
                See Use Cases
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
}
