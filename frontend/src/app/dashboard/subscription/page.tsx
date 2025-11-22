'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Calendar, TrendingUp, ExternalLink } from 'lucide-react'

interface Subscription {
  plan_name: string
  amount: number
  status: string
  next_billing_date: string
  cancel_at_period_end: boolean
}

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubscription()
  }, [])

  const fetchSubscription = async () => {
    try {
      const token = localStorage.getItem('access_token')
      console.log('Fetching profile with token:', token ? 'Token exists' : 'No token')
      const res = await fetch('/api/auth/profile/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      console.log('Subscription response status:', res.status)
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") === -1) {
        const text = await res.text();
        console.error("Received non-JSON response:", text.substring(0, 200));
        throw new Error("Received non-JSON response");
      }

      const data = await res.json()

      // Mock subscription data based on user tier
      setSubscription({
        plan_name: data.subscription_tier || 'free',
        amount: data.subscription_tier === 'creator' ? 49 : data.subscription_tier === 'pro' ? 99 : data.subscription_tier === 'agency' ? 299 : 0,
        status: 'active',
        next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancel_at_period_end: false
      })
    } catch (error) {
      console.error('Failed to fetch subscription:', error)
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.error('Network error - possible causes:')
        console.error('1. Backend server not running')
        console.error('2. CORS issue')
        console.error('3. Browser extension blocking request')
        console.error('4. Proxy configuration issue')
      }
    } finally {
      setLoading(false)
    }
  }

  const openCustomerPortal = async () => {
    // TODO: Implement Stripe customer portal
    alert('Stripe customer portal integration coming soon!')
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const planColors = {
    free: 'bg-gray-100 text-gray-800',
    creator: 'bg-blue-100 text-blue-800',
    pro: 'bg-purple-100 text-purple-800',
    agency: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Subscription Management</h1>
        <p className="text-gray-600">Manage your billing and subscription details</p>
      </div>

      {subscription && (
        <div className="space-y-6">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Current Plan</CardTitle>
                  <CardDescription>Your active subscription</CardDescription>
                </div>
                <Badge className={planColors[subscription.plan_name as keyof typeof planColors]}>
                  {subscription.plan_name.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start space-x-3">
                  <CreditCard className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Monthly Cost</p>
                    <p className="text-2xl font-bold">
                      ${subscription.amount}
                      <span className="text-sm font-normal text-gray-500">/month</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Next Billing Date</p>
                    <p className="text-lg font-semibold">
                      {new Date(subscription.next_billing_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                      {subscription.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {subscription.cancel_at_period_end && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">
                    Your subscription will be cancelled at the end of the current billing period.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button onClick={openCustomerPortal} className="flex items-center gap-2">
                  Manage Subscription
                  <ExternalLink className="w-4 h-4" />
                </Button>
                {subscription.plan_name === 'free' && (
                  <Button variant="outline" onClick={() => window.location.href = '/pricing'}>
                    Upgrade Plan
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Plan Features */}
          <Card>
            <CardHeader>
              <CardTitle>Plan Features</CardTitle>
              <CardDescription>What's included in your plan</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {subscription.plan_name === 'free' && (
                  <>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      1 content block per month
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      1 platform
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Basic analytics
                    </li>
                  </>
                )}
                {subscription.plan_name === 'creator' && (
                  <>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      50 content blocks per month
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      All platforms
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Advanced analytics
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      5 video generations per month
                    </li>
                  </>
                )}
                {subscription.plan_name === 'pro' && (
                  <>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      200 content blocks per month
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Unlimited video generation
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Brand kit
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Team (3 users)
                    </li>
                  </>
                )}
                {subscription.plan_name === 'agency' && (
                  <>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Unlimited content blocks
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Team (10 users)
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      White-label
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Custom AI training
                    </li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
