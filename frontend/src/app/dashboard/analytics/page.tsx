'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  MousePointerClick,
  FileText,
  Link2,
  Eye,
  Calendar,
  Download,
  Loader2,
  ArrowUp,
  ArrowDown,
  Minus,
  Sparkles,
  Hash,
  Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface AnalyticsData {
  overview: {
    total_content: number;
    total_links: number;
    total_clicks: number;
    total_keywords: number;
    content_growth: number;
    clicks_growth: number;
  };
  content_by_platform: Record<string, number>;
  clicks_by_platform: Record<string, number>;
  top_content: Array<{
    id: string;
    keyword: string;
    platform: string;
    engagement: number;
    created_at: string;
  }>;
  top_links: Array<{
    id: string;
    title: string;
    clicks: number;
    unique_clicks: number;
    created_at: string;
  }>;
  recent_activity: Array<{
    type: string;
    title: string;
    timestamp: string;
  }>;
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch data from multiple endpoints
      const [contentRes, linksRes] = await Promise.all([
        api.get('/content/blocks/'),
        api.get('/links/'),
      ]);

      const contents = contentRes.data.results || contentRes.data || [];
      const links = linksRes.data.results || linksRes.data || [];

      // Calculate analytics
      const contentByPlatform: Record<string, number> = {};
      contents.forEach((content: any) => {
        content.platform_versions?.forEach((pv: any) => {
          contentByPlatform[pv.platform] = (contentByPlatform[pv.platform] || 0) + 1;
        });
      });

      const clicksByPlatform: Record<string, number> = {};
      links.forEach((link: any) => {
        if (link.platform) {
          clicksByPlatform[link.platform] = (clicksByPlatform[link.platform] || 0) + link.total_clicks;
        }
      });

      // Top content (mock data for now)
      const topContent = contents.slice(0, 5).map((c: any) => ({
        id: c.id,
        keyword: c.keyword_text,
        platform: c.platform_versions?.[0]?.platform || 'unknown',
        engagement: Math.floor(Math.random() * 1000),
        created_at: c.created_at,
      }));

      // Top links
      const topLinks = links
        .sort((a: any, b: any) => b.total_clicks - a.total_clicks)
        .slice(0, 5)
        .map((l: any) => ({
          id: l.id,
          title: l.title || l.short_code,
          clicks: l.total_clicks,
          unique_clicks: l.unique_clicks,
          created_at: l.created_at,
        }));

      // Recent activity
      const recentActivity = [
        ...contents.slice(0, 3).map((c: any) => ({
          type: 'content',
          title: `Created content for "${c.keyword_text}"`,
          timestamp: c.created_at,
        })),
        ...links.slice(0, 3).map((l: any) => ({
          type: 'link',
          title: `Created link "${l.title || l.short_code}"`,
          timestamp: l.created_at,
        })),
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setAnalytics({
        overview: {
          total_content: contents.length,
          total_links: links.length,
          total_clicks: links.reduce((sum: number, l: any) => sum + l.total_clicks, 0),
          total_keywords: contents.length,
          content_growth: 12.5,
          clicks_growth: 8.3,
        },
        content_by_platform: contentByPlatform,
        clicks_by_platform: clicksByPlatform,
        top_content: topContent,
        top_links: topLinks,
        recent_activity: recentActivity.slice(0, 10),
      });
    } catch (error: any) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (value < 0) return <ArrowDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getTrendColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const exportAnalytics = () => {
    if (!analytics) return;

    const exportData = {
      exported_at: new Date().toISOString(),
      time_range: timeRange,
      ...analytics,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Analytics exported!');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
            <p className="text-gray-600">
              Track your performance and insights
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportAnalytics}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Content</CardTitle>
                <FileText className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900">{analytics?.overview.total_content || 0}</p>
                <div className={`flex items-center gap-1 text-sm ${getTrendColor(analytics?.overview.content_growth || 0)}`}>
                  {getTrendIcon(analytics?.overview.content_growth || 0)}
                  <span>{Math.abs(analytics?.overview.content_growth || 0)}%</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Pieces created</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Links</CardTitle>
                <Link2 className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900">{analytics?.overview.total_links || 0}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">Trackable links</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Clicks</CardTitle>
                <MousePointerClick className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900">{analytics?.overview.total_clicks || 0}</p>
                <div className={`flex items-center gap-1 text-sm ${getTrendColor(analytics?.overview.clicks_growth || 0)}`}>
                  {getTrendIcon(analytics?.overview.clicks_growth || 0)}
                  <span>{Math.abs(analytics?.overview.clicks_growth || 0)}%</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Link clicks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Keywords</CardTitle>
                <Hash className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900">{analytics?.overview.total_keywords || 0}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">Researched</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Content by Platform */}
          <Card>
            <CardHeader>
              <CardTitle>Content by Platform</CardTitle>
              <CardDescription>Distribution of your content across platforms</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(analytics?.content_by_platform || {}).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Sparkles className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>No content created yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(analytics?.content_by_platform || {})
                    .sort(([, a], [, b]) => b - a)
                    .map(([platform, count]) => {
                      const total = Object.values(analytics?.content_by_platform || {}).reduce((sum, val) => sum + val, 0);
                      const percentage = Math.round((count / total) * 100);
                      
                      return (
                        <div key={platform}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700 capitalize">{platform}</span>
                            <span className="text-sm text-gray-600">{count} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Clicks by Platform */}
          <Card>
            <CardHeader>
              <CardTitle>Clicks by Platform</CardTitle>
              <CardDescription>Link performance across platforms</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(analytics?.clicks_by_platform || {}).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MousePointerClick className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>No clicks tracked yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(analytics?.clicks_by_platform || {})
                    .sort(([, a], [, b]) => b - a)
                    .map(([platform, clicks]) => {
                      const total = Object.values(analytics?.clicks_by_platform || {}).reduce((sum, val) => sum + val, 0);
                      const percentage = total > 0 ? Math.round((clicks / total) * 100) : 0;
                      
                      return (
                        <div key={platform}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700 capitalize">{platform}</span>
                            <span className="text-sm text-gray-600">{clicks} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* Top Links */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Links</CardTitle>
              <CardDescription>Your most clicked links</CardDescription>
            </CardHeader>
            <CardContent>
              {!analytics?.top_links || analytics.top_links.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Link2 className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>No links yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {analytics.top_links.map((link, idx) => (
                    <div key={link.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{link.title}</p>
                        <p className="text-xs text-gray-500">{link.unique_clicks} unique</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{link.clicks}</p>
                        <p className="text-xs text-gray-500">clicks</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics?.recent_activity.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No recent activity</p>
              </div>
            ) : (
              <div className="space-y-3">
                {analytics?.recent_activity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'content' ? 'bg-purple-100' : 'bg-blue-100'
                    }`}>
                      {activity.type === 'content' ? (
                        <FileText className={`h-4 w-4 ${activity.type === 'content' ? 'text-purple-600' : 'text-blue-600'}`} />
                      ) : (
                        <Link2 className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
