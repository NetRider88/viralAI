'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Search, FileText, Link2, TrendingUp, Zap, Loader2, ArrowRight } from 'lucide-react';
import api from '@/lib/api';

interface UsageStats {
  content_blocks_generated: number;
  keywords_researched: number;
  images_generated: number;
  links_created: number;
  total_usage: number;
  limit: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loadUser } = useAuthStore();
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (!isAuthenticated && user === null) {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const response = await api.get('/auth/usage/');
        setUsage(response.data);
      } catch (error) {
        console.error('Failed to fetch usage:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUsage();
    }
  }, [user]);

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const usagePercentage = usage ? (usage.total_usage / usage.limit) * 100 : 0;

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.first_name || user.username}! 👋
        </h1>
        <p className="text-gray-600">
          Ready to create some viral content?
        </p>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Content Generated
            </CardTitle>
            <Sparkles className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usage?.content_blocks_generated || 0}</div>
            <p className="text-xs text-gray-500 mt-1">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Keywords Researched
            </CardTitle>
            <Search className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usage?.keywords_researched || 0}</div>
            <p className="text-xs text-gray-500 mt-1">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Images Created
            </CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usage?.images_generated || 0}</div>
            <p className="text-xs text-gray-500 mt-1">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Usage Limit
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usage?.total_usage || 0}/{usage?.limit || 100}
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-purple-200">
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle>Keyword Research</CardTitle>
            <CardDescription>
              Discover trending keywords and viral topics across platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full group" 
              onClick={() => router.push('/dashboard/keywords')}
            >
              Start Research
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-purple-200">
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle>Generate Content</CardTitle>
            <CardDescription>
              Create AI-powered viral content for all platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full group" 
              onClick={() => router.push('/dashboard/content')}
            >
              Create Content
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-purple-200">
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
              <Link2 className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle>Track Links</CardTitle>
            <CardDescription>
              Create trackable links and monitor performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full group" 
              onClick={() => router.push('/dashboard/links')}
            >
              Manage Links
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      {usage && usage.total_usage === 0 && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              <CardTitle>Get Started</CardTitle>
            </div>
            <CardDescription>
              Follow these steps to create your first viral content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-medium">Research Keywords</p>
                  <p className="text-sm text-gray-600">Find trending topics in your niche</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-medium">Generate Content</p>
                  <p className="text-sm text-gray-600">Create platform-optimized posts with AI</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-medium">Track Performance</p>
                  <p className="text-sm text-gray-600">Monitor engagement and optimize</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}
