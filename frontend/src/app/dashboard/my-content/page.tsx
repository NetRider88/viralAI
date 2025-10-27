'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  Copy,
  Check,
  Calendar,
  Hash,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Facebook,
  Loader2,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { PlatformPreview } from '@/components/PlatformPreview';

interface PlatformVersion {
  id: string;
  platform: string;
  content_type: string;
  caption: string;
  hashtags: string[];
  content_data: {
    hook?: string;
    cta?: string;
    slides?: any[];
  };
  images: string[];
  video_script?: string;
  character_count?: number;
}

interface ContentBlock {
  id: string;
  keyword_text: string;
  title?: string;
  niche?: string;
  content_angle?: string;
  tone: string;
  status?: string;
  platform_versions: PlatformVersion[];
  created_at: string;
  updated_at: string;
}

const platformIcons: Record<string, any> = {
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  linkedin: Linkedin,
  facebook: Facebook,
};

export default function MyContentPage() {
  const [contents, setContents] = useState<ContentBlock[]>([]);
  const [filteredContents, setFilteredContents] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [selectedContent, setSelectedContent] = useState<ContentBlock | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchContents();
  }, []);

  useEffect(() => {
    filterContents();
  }, [searchQuery, platformFilter, contents]);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/content/blocks/');
      setContents(response.data.results || response.data || []);
    } catch (error: any) {
      console.error('Failed to fetch contents:', error);
      toast.error('Failed to load your content');
    } finally {
      setLoading(false);
    }
  };

  const filterContents = () => {
    let filtered = [...contents];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(content =>
        content.keyword_text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Platform filter
    if (platformFilter !== 'all') {
      filtered = filtered.filter(content =>
        content.platform_versions?.some((p: PlatformVersion) => p.platform === platformFilter)
      );
    }

    setFilteredContents(filtered);
  };

  const deleteContent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      await api.delete(`/content/blocks/${id}/`);
      setContents(contents.filter(c => c.id !== id));
      toast.success('Content deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete content:', error);
      toast.error('Failed to delete content');
    }
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const exportContent = (content: ContentBlock) => {
    const exportData = {
      keyword: content.keyword_text,
      platforms: content.platform_versions,
      created_at: content.created_at,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${content.keyword_text.replace(/\s+/g, '_')}_content.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Content exported!');
  };

  const PlatformIcon = ({ platformId }: { platformId: string }) => {
    const Icon = platformIcons[platformId];
    return Icon ? <Icon className="h-4 w-4" /> : null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Content</h1>
          <p className="text-gray-600">
            View, manage, and export all your generated content
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Search */}
              <div className="md:col-span-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Platform Filter */}
              <div className="md:col-span-3">
                <Select value={platformFilter} onValueChange={setPlatformFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="twitter">Twitter/X</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View Mode */}
              <div className="md:col-span-3 flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  onClick={() => setViewMode('grid')}
                  className="flex-1"
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  onClick={() => setViewMode('list')}
                  className="flex-1"
                >
                  List
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : filteredContents.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery || platformFilter !== 'all' ? 'No content found' : 'No content yet'}
              </h3>
              <p className="text-gray-600 text-center max-w-md mb-4">
                {searchQuery || platformFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Start creating viral content with our AI-powered generator'}
              </p>
              {!searchQuery && platformFilter === 'all' && (
                <Button onClick={() => window.location.href = '/dashboard/content'}>
                  Create Content
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredContents.map((content) => (
              <Card key={content.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{content.keyword_text}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(content.created_at)}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteContent(content.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Platforms */}
                  <div>
                    <p className="text-xs text-gray-600 mb-2">Platforms</p>
                    <div className="flex flex-wrap gap-2">
                      {content.platform_versions?.map((platform: PlatformVersion, idx: number) => (
                        <Badge key={idx} variant="secondary" className="capitalize">
                          <PlatformIcon platformId={platform.platform} />
                          <span className="ml-1">{platform.platform}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Preview */}
                  {content.platform_versions?.[0] && (
                    <div className="text-sm text-gray-600 line-clamp-3">
                      {content.platform_versions[0].caption}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {content.platform_versions?.some((p: PlatformVersion) => p.images && p.images.length > 0) && (
                      <div className="flex items-center gap-1">
                        <ImageIcon className="h-3 w-3" />
                        <span>Images</span>
                      </div>
                    )}
                    {content.platform_versions?.some((p: PlatformVersion) => p.video_script) && (
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span>Script</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedContent(content)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportContent(content)}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* View Modal */}
        {selectedContent && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedContent(null)}>
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedContent.keyword_text}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Created {formatDate(selectedContent.created_at)}
                  </p>
                </div>
                <Button variant="ghost" onClick={() => setSelectedContent(null)}>
                  ✕
                </Button>
              </div>

              <div className="p-6 space-y-6">
                {/* Platform Tabs */}
                <Tabs defaultValue={selectedContent.platform_versions?.[0]?.platform}>
                  <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${selectedContent.platform_versions?.length || 1}, 1fr)` }}>
                    {selectedContent.platform_versions?.map((platform: PlatformVersion) => (
                      <TabsTrigger key={platform.platform} value={platform.platform} className="capitalize">
                        <PlatformIcon platformId={platform.platform} />
                        <span className="ml-2">{platform.platform}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {selectedContent.platform_versions?.map((platform: PlatformVersion) => (
                    <TabsContent key={platform.platform} value={platform.platform} className="mt-6 space-y-6">
                      {/* Platform Preview */}
                      <div>
                        <h3 className="text-sm font-semibold mb-3">Platform Preview</h3>
                        <PlatformPreview
                          platform={platform.platform}
                          caption={platform.caption}
                          hashtags={platform.hashtags || []}
                          hook={platform.content_data?.hook}
                          images={platform.images || []}
                        />
                      </div>

                      {/* Caption */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-semibold">Caption</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyText(platform.caption, 'Caption')}
                          >
                            {copiedText === 'Caption' ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm whitespace-pre-wrap">{platform.caption}</p>
                        </div>
                      </div>

                      {/* Hashtags */}
                      {platform.hashtags && platform.hashtags.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold">Hashtags</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyText(platform.hashtags.join(' '), 'Hashtags')}
                            >
                              {copiedText === 'Hashtags' ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {platform.hashtags.map((tag, idx) => (
                              <Badge key={idx} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>

                {/* Images */}
                {selectedContent.platform_versions?.some((p: PlatformVersion) => p.images && p.images.length > 0) && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Generated Images</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedContent.platform_versions
                        .flatMap((p: PlatformVersion) => p.images || [])
                        .filter((url: string, idx: number, arr: string[]) => arr.indexOf(url) === idx)
                        .map((url: string, idx: number) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`Generated ${idx + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
