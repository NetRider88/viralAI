'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Link2,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Trash2,
  Edit,
  TrendingUp,
  MousePointerClick,
  Calendar,
  Loader2,
  Plus,
  BarChart3,
  Download,
  Eye,
  EyeOff,
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface TrackedLink {
  id: string;
  original_url: string;
  short_code: string;
  custom_slug?: string;
  title?: string;
  description?: string;
  platform?: string;
  campaign?: string;
  total_clicks: number;
  unique_clicks: number;
  is_active: boolean;
  created_at: string;
  expires_at?: string;
  qr_code_url?: string;
}

interface LinkClick {
  id: string;
  clicked_at: string;
  ip_address?: string;
  user_agent?: string;
  referer?: string;
  country?: string;
  city?: string;
  device_type?: string;
  browser?: string;
  os?: string;
}

interface AnalyticsData {
  clicks_by_device: Record<string, number>;
  clicks_by_browser: Record<string, number>;
  clicks_by_os: Record<string, number>;
  clicks_by_country: Record<string, number>;
  recent_clicks: LinkClick[];
}

// Analytics Components
function DeviceBreakdown({ linkId }: { linkId: string }) {
  const [data, setData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/links/${linkId}/analytics/`);
        setData(response.data.clicks_by_device || {});
      } catch (error) {
        console.error('Failed to fetch device data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [linkId]);

  if (loading) return <Loader2 className="h-6 w-6 animate-spin mx-auto" />;
  if (Object.keys(data).length === 0) return <p className="text-sm text-gray-500 text-center py-4">No data yet</p>;

  const total = Object.values(data).reduce((sum, val) => sum + val, 0);

  return (
    <div className="space-y-3">
      {Object.entries(data).sort(([, a], [, b]) => b - a).map(([device, count]) => {
        const percentage = Math.round((count / total) * 100);
        return (
          <div key={device}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium capitalize">{device}</span>
              <span className="text-sm text-gray-600">{count} ({percentage}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${percentage}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BrowserBreakdown({ linkId }: { linkId: string }) {
  const [data, setData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/links/${linkId}/analytics/`);
        setData(response.data.clicks_by_browser || {});
      } catch (error) {
        console.error('Failed to fetch browser data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [linkId]);

  if (loading) return <Loader2 className="h-6 w-6 animate-spin mx-auto" />;
  if (Object.keys(data).length === 0) return <p className="text-sm text-gray-500 text-center py-4">No data yet</p>;

  const total = Object.values(data).reduce((sum, val) => sum + val, 0);

  return (
    <div className="space-y-3">
      {Object.entries(data).sort(([, a], [, b]) => b - a).map(([browser, count]) => {
        const percentage = Math.round((count / total) * 100);
        return (
          <div key={browser}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">{browser}</span>
              <span className="text-sm text-gray-600">{count} ({percentage}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OSBreakdown({ linkId }: { linkId: string }) {
  const [data, setData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/links/${linkId}/analytics/`);
        setData(response.data.clicks_by_os || {});
      } catch (error) {
        console.error('Failed to fetch OS data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [linkId]);

  if (loading) return <Loader2 className="h-6 w-6 animate-spin mx-auto" />;
  if (Object.keys(data).length === 0) return <p className="text-sm text-gray-500 text-center py-4">No data yet</p>;

  const total = Object.values(data).reduce((sum, val) => sum + val, 0);

  return (
    <div className="space-y-3">
      {Object.entries(data).sort(([, a], [, b]) => b - a).map(([os, count]) => {
        const percentage = Math.round((count / total) * 100);
        return (
          <div key={os}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">{os}</span>
              <span className="text-sm text-gray-600">{count} ({percentage}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: `${percentage}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CountryBreakdown({ linkId }: { linkId: string }) {
  const [data, setData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/links/${linkId}/analytics/`);
        setData(response.data.clicks_by_country || {});
      } catch (error) {
        console.error('Failed to fetch country data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [linkId]);

  if (loading) return <Loader2 className="h-6 w-6 animate-spin mx-auto" />;
  if (Object.keys(data).length === 0) return <p className="text-sm text-gray-500 text-center py-4">No data yet</p>;

  const total = Object.values(data).reduce((sum, val) => sum + val, 0);

  return (
    <div className="space-y-3">
      {Object.entries(data).sort(([, a], [, b]) => b - a).map(([country, count]) => {
        const percentage = Math.round((count / total) * 100);
        return (
          <div key={country}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">{country}</span>
              <span className="text-sm text-gray-600">{count} ({percentage}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${percentage}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RecentClicksTable({ linkId }: { linkId: string }) {
  const [clicks, setClicks] = useState<LinkClick[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/links/${linkId}/analytics/`);
        setClicks(response.data.recent_clicks || []);
      } catch (error) {
        console.error('Failed to fetch recent clicks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [linkId]);

  if (loading) return <Loader2 className="h-6 w-6 animate-spin mx-auto" />;
  if (clicks.length === 0) return <p className="text-sm text-gray-500 text-center py-4">No clicks yet</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b">
          <tr className="text-left">
            <th className="pb-2 font-medium text-gray-600">Time</th>
            <th className="pb-2 font-medium text-gray-600">Device</th>
            <th className="pb-2 font-medium text-gray-600">Browser</th>
            <th className="pb-2 font-medium text-gray-600">OS</th>
            <th className="pb-2 font-medium text-gray-600">Location</th>
          </tr>
        </thead>
        <tbody>
          {clicks.map((click) => (
            <tr key={click.id} className="border-b last:border-0">
              <td className="py-3 text-gray-900">
                {new Date(click.clicked_at).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </td>
              <td className="py-3 text-gray-600 capitalize">{click.device_type || 'Unknown'}</td>
              <td className="py-3 text-gray-600">{click.browser || 'Unknown'}</td>
              <td className="py-3 text-gray-600">{click.os || 'Unknown'}</td>
              <td className="py-3 text-gray-600">
                {click.city && click.country ? `${click.city}, ${click.country}` : click.country || 'Unknown'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function LinkTrackingPage() {
  const [links, setLinks] = useState<TrackedLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLink, setSelectedLink] = useState<TrackedLink | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  
  // Create link form
  const [originalUrl, setOriginalUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState('');
  const [campaign, setCampaign] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/links/');
      setLinks(response.data.results || response.data || []);
    } catch (error: any) {
      console.error('Failed to fetch links:', error);
      toast.error('Failed to load links');
    } finally {
      setLoading(false);
    }
  };

  const createLink = async () => {
    if (!originalUrl) {
      toast.error('Please enter a URL');
      return;
    }

    try {
      setCreating(true);
      const response = await api.post('/links/', {
        original_url: originalUrl,
        custom_slug: customSlug || undefined,
        title: title || undefined,
        description: description || undefined,
        platform: platform || undefined,
        campaign: campaign || undefined,
      });

      setLinks([response.data, ...links]);
      toast.success('Link created successfully!');
      
      // Reset form
      setOriginalUrl('');
      setCustomSlug('');
      setTitle('');
      setDescription('');
      setPlatform('');
      setCampaign('');
      setShowCreateModal(false);
    } catch (error: any) {
      console.error('Failed to create link:', error);
      toast.error(error.response?.data?.error || 'Failed to create link');
    } finally {
      setCreating(false);
    }
  };

  const deleteLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      await api.delete(`/links/${id}/`);
      setLinks(links.filter(l => l.id !== id));
      toast.success('Link deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete link:', error);
      toast.error('Failed to delete link');
    }
  };

  const toggleLinkStatus = async (link: TrackedLink) => {
    try {
      const response = await api.patch(`/links/${link.id}/`, {
        is_active: !link.is_active
      });
      
      setLinks(links.map(l => l.id === link.id ? response.data : l));
      toast.success(`Link ${link.is_active ? 'deactivated' : 'activated'}`);
    } catch (error: any) {
      console.error('Failed to update link:', error);
      toast.error('Failed to update link');
    }
  };

  const copyLink = (shortCode: string) => {
    const shortUrl = getShortUrl(shortCode);
    navigator.clipboard.writeText(shortUrl);
    setCopiedLink(shortCode);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const downloadQRCode = async (link: TrackedLink) => {
    try {
      const response = await api.get(`/links/${link.id}/qr-code/`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-${link.short_code}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('QR code downloaded!');
    } catch (error: any) {
      console.error('Failed to download QR code:', error);
      toast.error('Failed to download QR code');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getShortUrl = (shortCode: string | undefined) => {
    // Use backend URL for short links (port 8000)
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://127.0.0.1:8000';
    return `${backendUrl}/l/${shortCode || 'unknown'}/`;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Link Tracking</h1>
            <p className="text-gray-600">
              Create trackable short links and monitor their performance
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Link
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card key="total-links">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Links</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{links.length}</p>
            </CardContent>
          </Card>
          
          <Card key="total-clicks">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">
                {links.reduce((sum, link) => sum + (link.total_clicks || 0), 0)}
              </p>
            </CardContent>
          </Card>
          
          <Card key="unique-clicks">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Unique Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">
                {links.reduce((sum, link) => sum + (link.unique_clicks || 0), 0)}
              </p>
            </CardContent>
          </Card>
          
          <Card key="active-links">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Active Links</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">
                {links.filter(l => l.is_active).length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Links List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : links.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Link2 className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No links yet</h3>
              <p className="text-gray-600 text-center max-w-md mb-4">
                Create your first trackable link to start monitoring clicks and engagement
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Link
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {links.map((link) => (
              <Card key={link.id} className={!link.is_active ? 'opacity-60' : ''}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 space-y-3">
                      {/* Title and Status */}
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {link.title || link.short_code}
                        </h3>
                        <Badge key={`${link.id}-status`} variant={link.is_active ? 'default' : 'secondary'}>
                          {link.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        {link.platform && (
                          <Badge key={`${link.id}-platform`} variant="outline" className="capitalize">
                            {link.platform}
                          </Badge>
                        )}
                        {link.campaign && (
                          <Badge key={`${link.id}-campaign`} variant="outline">
                            {link.campaign}
                          </Badge>
                        )}
                      </div>

                      {/* Description */}
                      {link.description && (
                        <p className="text-sm text-gray-600">{link.description}</p>
                      )}

                      {/* Short URL */}
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Link2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <code className="text-sm font-mono text-purple-600 flex-1 truncate">
                          {getShortUrl(link.short_code)}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyLink(link.short_code)}
                        >
                          {copiedLink === link.short_code ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      {/* Original URL */}
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <ExternalLink className="h-3 w-3" />
                        <span className="truncate">{link.original_url}</span>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6 text-sm">
                        <div key={`${link.id}-stat-clicks`} className="flex items-center gap-2">
                          <MousePointerClick className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{link.total_clicks || 0}</span>
                          <span className="text-gray-500">clicks</span>
                        </div>
                        <div key={`${link.id}-stat-unique`} className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{link.unique_clicks || 0}</span>
                          <span className="text-gray-500">unique</span>
                        </div>
                        <div key={`${link.id}-stat-date`} className="flex items-center gap-2 text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(link.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        key={`${link.id}-qr`}
                        variant="outline"
                        size="sm"
                        onClick={() => downloadQRCode(link)}
                      >
                        <QrCode className="h-4 w-4" />
                      </Button>
                      <Button
                        key={`${link.id}-toggle`}
                        variant="outline"
                        size="sm"
                        onClick={() => toggleLinkStatus(link)}
                      >
                        {link.is_active ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        key={`${link.id}-analytics`}
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedLink(link)}
                      >
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button
                        key={`${link.id}-delete`}
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteLink(link.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Link Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Create Trackable Link</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Generate a short link with tracking capabilities
                  </p>
                </div>
                <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                  ✕
                </Button>
              </div>

              <div className="p-6 space-y-6">
                {/* Original URL */}
                <div>
                  <Label htmlFor="original_url">Destination URL *</Label>
                  <Input
                    id="original_url"
                    type="url"
                    placeholder="https://example.com/your-page"
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    The URL where users will be redirected
                  </p>
                </div>

                {/* Custom Slug */}
                <div>
                  <Label htmlFor="custom_slug">Custom Slug (Optional)</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-gray-500">{window.location.origin}/l/</span>
                    <Input
                      id="custom_slug"
                      placeholder="my-link"
                      value={customSlug}
                      onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty for auto-generated code
                  </p>
                </div>

                {/* Title */}
                <div>
                  <Label htmlFor="title">Title (Optional)</Label>
                  <Input
                    id="title"
                    placeholder="My Campaign Link"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    placeholder="Link for Instagram bio"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-2"
                  />
                </div>

                {/* Platform and Campaign */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="platform">Platform (Optional)</Label>
                    <Select value={platform} onValueChange={setPlatform}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="twitter">Twitter/X</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="campaign">Campaign (Optional)</Label>
                    <Input
                      id="campaign"
                      placeholder="summer-sale-2025"
                      value={campaign}
                      onChange={(e) => setCampaign(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={createLink}
                    disabled={creating || !originalUrl}
                    className="flex-1"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Link
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    disabled={creating}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Modal */}
        {selectedLink && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedLink(null)}>
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedLink.title || selectedLink.short_code}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Link Analytics
                  </p>
                </div>
                <Button variant="ghost" onClick={() => setSelectedLink(null)}>
                  ✕
                </Button>
              </div>

              <div className="p-6 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card key="modal-total">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600">Total Clicks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-gray-900">{selectedLink.total_clicks}</p>
                    </CardContent>
                  </Card>
                  
                  <Card key="modal-unique">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600">Unique Clicks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-gray-900">{selectedLink.unique_clicks}</p>
                    </CardContent>
                  </Card>
                  
                  <Card key="modal-rate">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600">Click Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedLink.total_clicks > 0 
                          ? Math.round((selectedLink.unique_clicks / selectedLink.total_clicks) * 100) 
                          : 0}%
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card key="modal-status">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600">Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge variant={selectedLink.is_active ? 'default' : 'secondary'}>
                        {selectedLink.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </CardContent>
                  </Card>
                </div>

                {/* Link Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Link Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-600">Short URL</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-sm font-mono text-purple-600 flex-1">
                          {getShortUrl(selectedLink.short_code)}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyLink(selectedLink.short_code)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs text-gray-600">Destination URL</Label>
                      <p className="text-sm text-gray-900 mt-1 break-all">{selectedLink.original_url}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {selectedLink.platform && (
                        <div>
                          <Label className="text-xs text-gray-600">Platform</Label>
                          <p className="text-sm text-gray-900 mt-1 capitalize">{selectedLink.platform}</p>
                        </div>
                      )}
                      
                      {selectedLink.campaign && (
                        <div>
                          <Label className="text-xs text-gray-600">Campaign</Label>
                          <p className="text-sm text-gray-900 mt-1">{selectedLink.campaign}</p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label className="text-xs text-gray-600">Created</Label>
                      <p className="text-sm text-gray-900 mt-1">{formatDate(selectedLink.created_at)}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Device Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Device Types</CardTitle>
                      <CardDescription>Clicks by device category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DeviceBreakdown linkId={selectedLink.id} />
                    </CardContent>
                  </Card>

                  {/* Browser Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Browsers</CardTitle>
                      <CardDescription>Clicks by browser</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <BrowserBreakdown linkId={selectedLink.id} />
                    </CardContent>
                  </Card>

                  {/* Operating Systems */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Operating Systems</CardTitle>
                      <CardDescription>Clicks by OS</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <OSBreakdown linkId={selectedLink.id} />
                    </CardContent>
                  </Card>

                  {/* Geographic Data */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Geographic Location</CardTitle>
                      <CardDescription>Clicks by country</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CountryBreakdown linkId={selectedLink.id} />
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Clicks Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Clicks</CardTitle>
                    <CardDescription>Latest 10 clicks on this link</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentClicksTable linkId={selectedLink.id} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
