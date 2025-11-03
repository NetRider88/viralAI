'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TrendingUp, Loader2, Target, Copy, Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface Niche {
  id: string;
  name: string;
  description: string;
  seed_keywords: string[];
}

interface NicheKeyword {
  keyword: string;
  trend: string;
  value: number;
  growth: string;
  popularity: string;
}

const nicheIcons: Record<string, string> = {
  technology: '💻',
  health: '💪',
  business: '💼',
  finance: '💰',
  lifestyle: '🎨',
  entertainment: '🎬',
  education: '📚',
  sports: '⚽',
  news: '📰',
  ecommerce: '🛒',
};

export default function NicheExplorerPage() {
  const [niches, setNiches] = useState<Niche[]>([]);
  const [selectedNiche, setSelectedNiche] = useState('');
  const [keywords, setKeywords] = useState<NicheKeyword[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  useEffect(() => {
    fetchNiches();
  }, []);

  const fetchNiches = async () => {
    try {
      const response = await api.get('/keywords/niches/');
      setNiches(response.data.niches || []);
    } catch (error) {
      console.error('Failed to fetch niches:', error);
      toast.error('Failed to load niches');
    }
  };

  const handleNicheChange = async (nicheId: string) => {
    setSelectedNiche(nicheId);
    if (!nicheId) {
      setKeywords([]);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/keywords/niche_keywords/?niche=${nicheId}&geo=US&limit=20`);
      setKeywords(response.data.keywords || []);
      toast.success(`Found ${response.data.total_count} trending keywords!`);
    } catch (error: any) {
      console.error('Failed to fetch niche keywords:', error);
      toast.error(error.response?.data?.error || 'Failed to fetch keywords');
      setKeywords([]);
    } finally {
      setLoading(false);
    }
  };

  const copyKeyword = (kw: string) => {
    navigator.clipboard.writeText(kw);
    setCopiedKeyword(kw);
    toast.success('Keyword copied!');
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  const getTrendColor = (trend: string) => {
    return trend === 'rising' ? 'text-green-600' : 'text-blue-600';
  };

  const getTrendBadge = (trend: string) => {
    return trend === 'rising' ? 'default' : 'secondary';
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Target className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Niche Explorer
            </h1>
          </div>
          <p className="text-gray-600">
            Discover trending keywords in specific niches powered by Google Trends
          </p>
        </div>

        {/* Niche Selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select a Niche</CardTitle>
            <CardDescription>
              Choose a niche category to see the top trending keywords
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-10">
                <Select value={selectedNiche} onValueChange={handleNicheChange}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Choose a niche category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {niches.map((niche) => (
                      <SelectItem key={niche.id} value={niche.id}>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{nicheIcons[niche.id] || '🎯'}</span>
                          <span className="font-medium">{niche.name}</span>
                          <span className="text-xs text-gray-500">
                            ({niche.seed_keywords.join(', ')})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                {selectedNiche && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedNiche('');
                      setKeywords([]);
                    }}
                    className="w-full h-12"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-12 w-12 text-purple-600 animate-spin mb-4" />
              <p className="text-gray-600">Fetching trending keywords...</p>
            </CardContent>
          </Card>
        )}

        {/* Keywords Results */}
        {!loading && keywords.length > 0 && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Keywords
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    {keywords.length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Rising Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {keywords.filter(k => k.trend === 'rising').length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Niche Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{nicheIcons[selectedNiche] || '🎯'}</span>
                    <span className="text-xl font-bold text-gray-900 capitalize">
                      {selectedNiche}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Keywords Grid */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Trending Keywords</CardTitle>
                    <CardDescription>
                      Real-time trending data from Google Trends
                    </CardDescription>
                  </div>
                  <Sparkles className="h-6 w-6 text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {keywords.map((kw, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-100 hover:border-purple-300 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                            {kw.keyword}
                          </h4>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant={getTrendBadge(kw.trend)}>
                              {kw.trend === 'rising' ? '📈 Rising' : '⭐ Popular'}
                            </Badge>
                            <span className={`text-sm font-bold ${getTrendColor(kw.trend)}`}>
                              {kw.growth}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {kw.popularity}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyKeyword(kw.keyword)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                        >
                          {copiedKeyword === kw.keyword ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <div className="mt-2 pt-2 border-t border-purple-200">
                        <p className="text-xs text-gray-600">
                          Trend Value: <span className="font-semibold">{kw.value}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!loading && !selectedNiche && keywords.length === 0 && (
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Target className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Select a Niche to Get Started
              </h3>
              <p className="text-gray-600 text-center max-w-md mb-6">
                Choose a niche category above to discover trending keywords powered by Google Trends API
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {niches.slice(0, 10).map((niche) => (
                  <Button
                    key={niche.id}
                    variant="outline"
                    onClick={() => handleNicheChange(niche.id)}
                    className="flex flex-col items-center gap-2 h-auto py-4"
                  >
                    <span className="text-2xl">{nicheIcons[niche.id] || '🎯'}</span>
                    <span className="text-xs font-medium">{niche.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Results */}
        {!loading && selectedNiche && keywords.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-gray-600">No trending keywords found for this niche</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
