import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/layout/Footer';
import { 
  Sparkles, 
  ArrowRight,
  Target,
  Users,
  Rocket,
  Heart,
  Zap,
  Globe,
  TrendingUp,
  Award,
  Shield,
  Lightbulb
} from 'lucide-react';

export default function AboutPage() {
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
            <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="/about" className="text-sm font-medium text-primary">
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
          <Heart className="h-3 w-3 mr-1" />
          About Us
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Democratizing Content Creation
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          We believe everyone deserves access to professional-grade content creation tools, 
          regardless of budget or technical expertise.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5">
            <CardHeader>
              <Target className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-3xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground">
                To empower creators, businesses, and agencies with cutting-edge AI technology 
                that makes professional content creation accessible, affordable, and effortless. 
                We're leveling the playing field so everyone can compete in the digital landscape.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
            <CardHeader>
              <Rocket className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle className="text-3xl">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground">
                A world where creativity knows no bounds, where anyone with an idea can bring it 
                to life with professional quality. We envision a future where AI amplifies human 
                creativity rather than replacing it.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Story */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-center">Our Story</h2>
          <div className="space-y-6 text-lg text-muted-foreground">
            <p>
              VIRAL.AI was born from a simple observation: content creation shouldn't be a luxury. 
              We watched talented creators struggle with expensive tools, small businesses unable 
              to compete with big brands, and agencies drowning in manual work.
            </p>
            <p>
              As a product of <Link href="https://ai-it.io" target="_blank" className="text-primary hover:underline font-semibold">AI-IT.io</Link>, 
              a leading AI solutions provider, we had the expertise and technology to solve this problem. 
              We combined the latest AI models with intuitive design to create a platform that feels 
              like magic but works like a well-oiled machine.
            </p>
            <p>
              Today, thousands of creators, businesses, and agencies use VIRAL.AI to produce 
              content that drives real results. But we're just getting started.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Lightbulb className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Innovation First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We constantly push boundaries, integrating the latest AI advancements to give 
                  you the best tools available.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>User-Centric</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Every feature is designed with you in mind. Your success is our success, 
                  and we listen to your feedback.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No hidden fees, no surprises. We're upfront about what we offer and how 
                  our platform works.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Accessibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Professional tools shouldn't cost a fortune. We make enterprise-grade 
                  technology accessible to everyone.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Results-Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We measure our success by your results. Every feature is built to help 
                  you achieve your goals.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Award className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We never compromise on quality. From our AI models to our user experience, 
                  excellence is non-negotiable.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI-IT.io Connection */}
        <Card className="bg-gradient-to-r from-primary/10 to-purple-600/10 border-primary/20">
          <CardHeader className="text-center">
            <Badge className="mb-4 mx-auto" variant="outline">
              <Zap className="h-3 w-3 mr-1" />
              Powered by AI-IT.io
            </Badge>
            <CardTitle className="text-3xl md:text-4xl mb-4">Built on Expertise</CardTitle>
            <CardDescription className="text-base max-w-2xl mx-auto">
              VIRAL.AI is proudly developed by AI-IT.io, a leading AI solutions provider with 
              years of experience in artificial intelligence, machine learning, and enterprise software.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              AI-IT.io has helped hundreds of businesses harness the power of AI. With VIRAL.AI, 
              we're bringing that same enterprise-grade technology to creators and small businesses 
              at an accessible price point.
            </p>
            <Link href="https://ai-it.io" target="_blank">
              <Button size="lg" variant="outline" className="gap-2">
                Learn More About AI-IT.io <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-20 bg-muted/50 rounded-3xl mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">By the Numbers</h2>
          <p className="text-xl text-muted-foreground">
            Our impact in the content creation space
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">10K+</div>
            <p className="text-muted-foreground">Active Users</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">1M+</div>
            <p className="text-muted-foreground">Content Pieces Created</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">500K+</div>
            <p className="text-muted-foreground">Images Generated</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">95%</div>
            <p className="text-muted-foreground">User Satisfaction</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-primary to-purple-600 text-primary-foreground border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-5xl mb-4">
              Join Our Community
            </CardTitle>
            <CardDescription className="text-primary-foreground/80 text-lg">
              Be part of the content creation revolution
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
