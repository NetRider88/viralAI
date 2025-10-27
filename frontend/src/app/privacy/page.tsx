import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/layout/Footer';
import { Sparkles, Shield, ArrowRight } from 'lucide-react';

export default function PrivacyPage() {
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
          <Shield className="h-3 w-3 mr-1" />
          Privacy Policy
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Your Privacy Matters
        </h1>
        <p className="text-xl text-muted-foreground mb-4 max-w-3xl mx-auto">
          We're committed to protecting your privacy and being transparent about how we collect, use, and protect your data.
        </p>
        <p className="text-sm text-muted-foreground">
          Last Updated: January 2025
        </p>
      </section>

      {/* Privacy Policy Content */}
      <section className="container mx-auto px-4 py-20 max-w-4xl">
        <div className="space-y-8">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Welcome to VIRAL.AI ("we," "our," or "us"). This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our AI-powered content creation 
                platform and services.
              </p>
              <p>
                VIRAL.AI is operated by AI-IT.io. By using our services, you agree to the collection and 
                use of information in accordance with this policy.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">1. Information You Provide</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Account Information:</strong> Name, email address, username, and password</li>
                  <li><strong>Profile Information:</strong> Optional profile details you choose to provide</li>
                  <li><strong>Content Data:</strong> Keywords, prompts, generated content, and custom instructions</li>
                  <li><strong>Payment Information:</strong> Billing details processed securely through third-party payment processors</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">2. Automatically Collected Information</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Usage Data:</strong> How you interact with our platform, features used, and time spent</li>
                  <li><strong>Device Information:</strong> Browser type, operating system, IP address, and device identifiers</li>
                  <li><strong>Analytics Data:</strong> Link clicks, content performance, and engagement metrics</li>
                  <li><strong>Cookies:</strong> Small data files stored on your device to enhance user experience</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>We use the collected information for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Service Delivery:</strong> To provide, maintain, and improve our AI content generation services</li>
                <li><strong>Personalization:</strong> To customize your experience and provide relevant content recommendations</li>
                <li><strong>Communication:</strong> To send you updates, newsletters, and important service announcements</li>
                <li><strong>Analytics:</strong> To understand usage patterns and improve our platform</li>
                <li><strong>Security:</strong> To detect, prevent, and address technical issues and fraudulent activity</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
              </ul>
            </CardContent>
          </Card>

          {/* AI and Data Processing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">AI and Data Processing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                <strong>Content Generation:</strong> When you use our AI features, your prompts and inputs are 
                processed by our AI models to generate content. We use industry-leading AI providers and ensure 
                your data is handled securely.
              </p>
              <p>
                <strong>Data Retention:</strong> Generated content is stored in your account and can be deleted 
                at any time. We retain your content only as long as necessary to provide our services or as 
                required by law.
              </p>
              <p>
                <strong>Model Training:</strong> We do not use your personal content or prompts to train AI models 
                without your explicit consent.
              </p>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">How We Share Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>We may share your information in the following circumstances:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Service Providers:</strong> Third-party vendors who help us operate our platform (e.g., hosting, payment processing, analytics)</li>
                <li><strong>AI Partners:</strong> AI model providers necessary to deliver our content generation services</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
              </ul>
              <p className="mt-4">
                <strong>We do not sell your personal information to third parties.</strong>
              </p>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Data Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We implement industry-standard security measures to protect your information, including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure authentication and access controls</li>
                <li>Regular security audits and updates</li>
                <li>Secure data centers and infrastructure</li>
              </ul>
              <p className="mt-4">
                However, no method of transmission over the internet is 100% secure. While we strive to protect 
                your information, we cannot guarantee absolute security.
              </p>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Your Privacy Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>You have the following rights regarding your personal information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Export:</strong> Download your content and data</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Restriction:</strong> Request limitation of processing your information</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us at{' '}
                <Link href="mailto:john@ai-it.io" className="text-primary hover:underline">
                  john@ai-it.io
                </Link>
              </p>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We use cookies and similar tracking technologies to enhance your experience. You can control 
                cookie preferences through your browser settings.
              </p>
              <p>
                <strong>Types of cookies we use:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Essential Cookies:</strong> Required for the platform to function</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how you use our services</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Our services are not intended for children under 13 years of age. We do not knowingly collect 
                personal information from children under 13. If you believe we have collected information from 
                a child under 13, please contact us immediately.
              </p>
            </CardContent>
          </Card>

          {/* International Users */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Your information may be transferred to and processed in countries other than your country of 
                residence. These countries may have different data protection laws. We ensure appropriate 
                safeguards are in place to protect your information.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by 
                posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
              <p>
                We encourage you to review this Privacy Policy periodically for any changes.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="space-y-2">
                <p>
                  <strong>Email:</strong>{' '}
                  <Link href="mailto:john@ai-it.io" className="text-primary hover:underline">
                    john@ai-it.io
                  </Link>
                </p>
                <p>
                  <strong>Website:</strong>{' '}
                  <Link href="https://ai-it.io" target="_blank" className="text-primary hover:underline">
                    ai-it.io
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-primary to-purple-600 text-primary-foreground border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl mb-4">
              Ready to Get Started?
            </CardTitle>
            <p className="text-primary-foreground/80 text-lg">
              Create amazing content with confidence, knowing your privacy is protected
            </p>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="gap-2">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="gap-2 bg-transparent text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10">
                Learn More About Us
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
}
