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
import { Search, Loader2, TrendingUp, Hash, Copy, Check, Instagram, Youtube, Twitter, Linkedin, Facebook, Info, Globe, Languages } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface KeywordResult {
  keyword: string;
  popularity_score?: number;
  estimated_volume?: string;
  search_volume?: number;
  competition?: string;
  trend?: string;
}

interface PlatformBreakdown {
  platform: string;
  keywords: (string | { keyword: string })[];
  count: number;
}

interface YouTubeData {
  keyword: string;
  platform: string;
  video_count: number;
  total_views: number;
  avg_views: number;
  total_likes: number;
  total_comments: number;
  engagement_rate: number;
  estimated_monthly_searches: string;
  competition_level: string;
  top_videos: any[];
}

interface ResearchResult {
  keyword: string;
  country: string;
  language: string;
  questions: KeywordResult[];
  prepositions: KeywordResult[];
  comparisons: KeywordResult[];
  alphabetical: KeywordResult[];
  platform_breakdown: PlatformBreakdown[];
  total_keywords: number;
  cached: boolean;
  youtube?: YouTubeData;
}

const platformIcons: Record<string, any> = {
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  linkedin: Linkedin,
  facebook: Facebook,
  tiktok: Hash,
};

export default function KeywordResearchPage() {
  const [keyword, setKeyword] = useState('');
  const [country, setCountry] = useState('us');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ResearchResult | null>(null);
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  // Load results from sessionStorage on mount
  useEffect(() => {
    const savedResults = sessionStorage.getItem('keywordResearchResults');
    const savedKeyword = sessionStorage.getItem('keywordResearchKeyword');
    const savedCountry = sessionStorage.getItem('keywordResearchCountry');
    const savedLanguage = sessionStorage.getItem('keywordResearchLanguage');
    
    if (savedResults) {
      try {
        setResults(JSON.parse(savedResults));
      } catch (e) {
        console.error('Failed to parse saved results:', e);
      }
    }
    if (savedKeyword) setKeyword(savedKeyword);
    if (savedCountry) setCountry(savedCountry);
    if (savedLanguage) setLanguage(savedLanguage);
  }, []);

  const handleResearch = async () => {
    if (!keyword.trim()) {
      toast.error('Please enter a keyword');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/keywords/research/', {
        keyword: keyword.trim(),
        country,
        language,
      });
      
      // Backend returns { cached: boolean, data: {...} }
      const researchData = response.data.data;
      
      // Helper function to flatten keyword arrays
      // Backend returns: [{ category, query, suggestions: [...], count }]
      // Frontend expects: [{ keyword: string }]
      const flattenKeywords = (data: any[]): KeywordResult[] => {
        if (!data || !Array.isArray(data)) return [];
        const flattened: KeywordResult[] = [];
        data.forEach(item => {
          if (item.suggestions && Array.isArray(item.suggestions)) {
            item.suggestions.forEach((suggestion: any) => {
              // Handle both string and object formats
              if (typeof suggestion === 'string') {
                flattened.push({ keyword: suggestion });
              } else if (suggestion && typeof suggestion === 'object') {
                flattened.push({
                  keyword: suggestion.keyword || '',
                  popularity_score: suggestion.popularity_score,
                  estimated_volume: suggestion.estimated_volume
                });
              }
            });
          }
        });
        return flattened;
      };
      
      // Transform platform_breakdown from dict to array
      const platformBreakdownArray = researchData.platform_breakdown 
        ? Object.entries(researchData.platform_breakdown).map(([platform, data]: [string, any]) => ({
            platform,
            keywords: [], // Backend doesn't return individual keywords per platform
            count: data.count || 0,
          }))
        : [];
      
      // Transform to match frontend interface
      const questions = flattenKeywords(researchData.questions);
      const prepositions = flattenKeywords(researchData.prepositions);
      const comparisons = flattenKeywords(researchData.comparisons);
      const alphabetical = flattenKeywords(researchData.alphabetical);
      
      const transformedData: ResearchResult = {
        keyword: researchData.keyword,
        country: researchData.country,
        language: researchData.language,
        questions,
        prepositions,
        comparisons,
        alphabetical,
        platform_breakdown: platformBreakdownArray,
        total_keywords: questions.length + prepositions.length + comparisons.length + alphabetical.length,
        cached: response.data.cached || false,
        youtube: response.data.youtube, // Add YouTube data
      };
      
      setResults(transformedData);
      
      // Save to sessionStorage
      sessionStorage.setItem('keywordResearchResults', JSON.stringify(transformedData));
      sessionStorage.setItem('keywordResearchKeyword', keyword.trim());
      sessionStorage.setItem('keywordResearchCountry', country);
      sessionStorage.setItem('keywordResearchLanguage', language);
      
      toast.success(response.data.cached ? 'Loaded from cache!' : 'Keyword research completed!');
    } catch (error: any) {
      console.error('Research failed:', error);
      toast.error(error.response?.data?.error || 'Failed to research keywords');
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

  const KeywordCard = ({ kw }: { kw: KeywordResult }) => {
    const getPopularityColor = (score?: number) => {
      if (!score) return 'text-gray-500';
      if (score >= 9) return 'text-green-600';
      if (score >= 7) return 'text-blue-600';
      if (score >= 5) return 'text-yellow-600';
      return 'text-gray-500';
    };

    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{kw.keyword}</p>
          {kw.estimated_volume && (
            <div className="flex items-center gap-2 mt-1">
              <TrendingUp className={`h-3 w-3 ${getPopularityColor(kw.popularity_score)}`} />
              <p className="text-xs text-gray-500">
                Est. {kw.estimated_volume} searches/month
              </p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyKeyword(kw.keyword)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copiedKeyword === kw.keyword ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Keyword Research
            </h1>
            <p className="text-gray-600">
              Discover trending keywords and viral topics across all platforms
            </p>
          </div>
          {results && (
            <Button
              variant="outline"
              onClick={() => {
                setResults(null);
                setKeyword('');
                sessionStorage.removeItem('keywordResearchResults');
                sessionStorage.removeItem('keywordResearchKeyword');
                sessionStorage.removeItem('keywordResearchCountry');
                sessionStorage.removeItem('keywordResearchLanguage');
                toast.success('Results cleared');
              }}
            >
              Clear Results
            </Button>
          )}
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Keywords</CardTitle>
            <CardDescription>
              Enter a seed keyword to discover related searches and questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-6">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Keyword
                </label>
                <Input
                  placeholder="e.g., AI tools, fitness tips, recipe ideas..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleResearch()}
                  className="h-11"
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center gap-1 mb-2">
                  <label className="text-sm font-medium text-gray-700">Country</label>
                  <div className="group relative">
                    <Info className="h-3 w-3 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 w-56">
                      <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg">
                        <p className="font-semibold mb-1">Country Targeting</p>
                        <p className="text-gray-300">Affects which keyword suggestions you get based on regional search trends and popularity.</p>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                          <div className="border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="us">🇺🇸 United States</SelectItem>
                    <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
                    <SelectItem value="ca">🇨🇦 Canada</SelectItem>
                    <SelectItem value="au">🇦🇺 Australia</SelectItem>
                    <SelectItem value="in">🇮🇳 India</SelectItem>
                    <SelectItem value="de">🇩🇪 Germany</SelectItem>
                    <SelectItem value="fr">🇫🇷 France</SelectItem>
                    <SelectItem value="es">🇪🇸 Spain</SelectItem>
                    <SelectItem value="it">🇮🇹 Italy</SelectItem>
                    <SelectItem value="br">🇧🇷 Brazil</SelectItem>
                    <SelectItem value="mx">🇲🇽 Mexico</SelectItem>
                    <SelectItem value="ar">🇦🇷 Argentina</SelectItem>
                    <SelectItem value="jp">🇯🇵 Japan</SelectItem>
                    <SelectItem value="kr">🇰🇷 South Korea</SelectItem>
                    <SelectItem value="cn">🇨🇳 China</SelectItem>
                    <SelectItem value="sg">🇸🇬 Singapore</SelectItem>
                    <SelectItem value="hk">🇭🇰 Hong Kong</SelectItem>
                    <SelectItem value="ae">🇦🇪 UAE</SelectItem>
                    <SelectItem value="sa">🇸🇦 Saudi Arabia</SelectItem>
                    <SelectItem value="za">🇿🇦 South Africa</SelectItem>
                    <SelectItem value="ng">🇳🇬 Nigeria</SelectItem>
                    <SelectItem value="eg">🇪🇬 Egypt</SelectItem>
                    <SelectItem value="nl">🇳🇱 Netherlands</SelectItem>
                    <SelectItem value="be">🇧🇪 Belgium</SelectItem>
                    <SelectItem value="se">🇸🇪 Sweden</SelectItem>
                    <SelectItem value="no">🇳🇴 Norway</SelectItem>
                    <SelectItem value="dk">🇩🇰 Denmark</SelectItem>
                    <SelectItem value="fi">🇫🇮 Finland</SelectItem>
                    <SelectItem value="pl">🇵🇱 Poland</SelectItem>
                    <SelectItem value="ru">🇷🇺 Russia</SelectItem>
                    <SelectItem value="tr">🇹🇷 Turkey</SelectItem>
                    <SelectItem value="id">🇮🇩 Indonesia</SelectItem>
                    <SelectItem value="th">🇹🇭 Thailand</SelectItem>
                    <SelectItem value="my">🇲🇾 Malaysia</SelectItem>
                    <SelectItem value="ph">🇵🇭 Philippines</SelectItem>
                    <SelectItem value="vn">🇻🇳 Vietnam</SelectItem>
                    <SelectItem value="nz">🇳🇿 New Zealand</SelectItem>
                    <SelectItem value="ie">🇮🇪 Ireland</SelectItem>
                    <SelectItem value="pt">🇵🇹 Portugal</SelectItem>
                    <SelectItem value="gr">🇬🇷 Greece</SelectItem>
                    <SelectItem value="il">🇮🇱 Israel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center gap-1 mb-2">
                  <label className="text-sm font-medium text-gray-700">Language</label>
                  <div className="group relative">
                    <Info className="h-3 w-3 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 w-56">
                      <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg">
                        <p className="font-semibold mb-1">Language Preference</p>
                        <p className="text-gray-300">Determines the language of keyword suggestions and search results from Google.</p>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                          <div className="border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish (Español)</SelectItem>
                    <SelectItem value="fr">French (Français)</SelectItem>
                    <SelectItem value="de">German (Deutsch)</SelectItem>
                    <SelectItem value="pt">Portuguese (Português)</SelectItem>
                    <SelectItem value="it">Italian (Italiano)</SelectItem>
                    <SelectItem value="nl">Dutch (Nederlands)</SelectItem>
                    <SelectItem value="ru">Russian (Русский)</SelectItem>
                    <SelectItem value="ja">Japanese (日本語)</SelectItem>
                    <SelectItem value="ko">Korean (한국어)</SelectItem>
                    <SelectItem value="zh">Chinese (中文)</SelectItem>
                    <SelectItem value="ar">Arabic (العربية)</SelectItem>
                    <SelectItem value="hi">Hindi (हिन्दी)</SelectItem>
                    <SelectItem value="tr">Turkish (Türkçe)</SelectItem>
                    <SelectItem value="pl">Polish (Polski)</SelectItem>
                    <SelectItem value="sv">Swedish (Svenska)</SelectItem>
                    <SelectItem value="no">Norwegian (Norsk)</SelectItem>
                    <SelectItem value="da">Danish (Dansk)</SelectItem>
                    <SelectItem value="fi">Finnish (Suomi)</SelectItem>
                    <SelectItem value="th">Thai (ไทย)</SelectItem>
                    <SelectItem value="vi">Vietnamese (Tiếng Việt)</SelectItem>
                    <SelectItem value="id">Indonesian (Bahasa)</SelectItem>
                    <SelectItem value="ms">Malay (Bahasa Melayu)</SelectItem>
                    <SelectItem value="he">Hebrew (עברית)</SelectItem>
                    <SelectItem value="el">Greek (Ελληνικά)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Button
                  onClick={handleResearch}
                  disabled={loading}
                  className="w-full h-11"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Researching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Research
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* YouTube Stats */}
            {results.youtube && results.youtube.video_count > 0 && (
              <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Youtube className="h-5 w-5 text-red-600" />
                    <CardTitle>YouTube Insights</CardTitle>
                  </div>
                  <CardDescription>
                    Real data from {results.youtube.video_count} YouTube videos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Total Views</p>
                      <p className="text-xl font-bold text-gray-900">
                        {(results.youtube.total_views / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Avg Views</p>
                      <p className="text-xl font-bold text-gray-900">
                        {(results.youtube.avg_views / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Engagement</p>
                      <p className="text-xl font-bold text-gray-900">
                        {results.youtube.engagement_rate}%
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <p className="text-xs text-gray-600">Competition</p>
                        <div className="group relative">
                          <Info className="h-3 w-3 text-gray-400 cursor-help" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 w-64">
                            <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg">
                              <p className="font-semibold mb-1">Competition Level</p>
                              <p className="text-gray-300 mb-2">Based on number of videos and average views:</p>
                              <ul className="space-y-1 text-gray-300">
                                <li>• <strong>Very High:</strong> 10K+ videos, 100K+ avg views</li>
                                <li>• <strong>High:</strong> 5K+ videos, 50K+ avg views</li>
                                <li>• <strong>Medium:</strong> 1K+ videos, 10K+ avg views</li>
                                <li>• <strong>Low:</strong> 500+ videos</li>
                                <li>• <strong>Very Low:</strong> &lt;500 videos</li>
                              </ul>
                              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                                <div className="border-4 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge variant={
                        results.youtube.competition_level === 'Very High' ? 'destructive' :
                        results.youtube.competition_level === 'High' ? 'default' :
                        'secondary'
                      }>
                        {results.youtube.competition_level}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-red-200">
                    <p className="text-sm text-gray-600">
                      <strong>Est. Monthly Searches:</strong> {results.youtube.estimated_monthly_searches}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

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
                    {results.total_keywords}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Platforms Analyzed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {results.platform_breakdown.length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Data Source
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={results.cached ? 'secondary' : 'default'}>
                    {results.cached ? '⚡ Cached' : '🔥 Fresh'}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Keyword Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Keyword Suggestions</CardTitle>
                <CardDescription>
                  Explore different types of keyword variations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="questions" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="questions">
                      Questions ({results.questions.length})
                    </TabsTrigger>
                    <TabsTrigger value="prepositions">
                      Prepositions ({results.prepositions.length})
                    </TabsTrigger>
                    <TabsTrigger value="comparisons">
                      Comparisons ({results.comparisons.length})
                    </TabsTrigger>
                    <TabsTrigger value="alphabetical">
                      A-Z ({results.alphabetical.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="questions" className="mt-6">
                    {results.questions.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {results.questions.map((kw, idx) => (
                          <KeywordCard key={idx} kw={kw} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">
                        No question keywords found
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="prepositions" className="mt-6">
                    {results.prepositions.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {results.prepositions.map((kw, idx) => (
                          <KeywordCard key={idx} kw={kw} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">
                        No preposition keywords found
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="comparisons" className="mt-6">
                    {results.comparisons.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {results.comparisons.map((kw, idx) => (
                          <KeywordCard key={idx} kw={kw} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">
                        No comparison keywords found
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="alphabetical" className="mt-6">
                    {results.alphabetical.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {results.alphabetical.map((kw, idx) => (
                          <KeywordCard key={idx} kw={kw} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">
                        No alphabetical keywords found
                      </p>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Platform Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Breakdown</CardTitle>
                <CardDescription>
                  See which platforms have the most keyword opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.platform_breakdown.map((platform, idx) => {
                    const Icon = platformIcons[platform.platform.toLowerCase()] || Hash;
                    return (
                      <Card key={idx} className="border-2">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5 text-purple-600" />
                            <CardTitle className="text-base capitalize">
                              {platform.platform}
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-gray-900 mb-3">
                            {platform.count} matches
                          </div>
                          {platform.keywords && platform.keywords.length > 0 ? (
                            <>
                              <div className="space-y-2">
                                {platform.keywords.slice(0, 3).map((kw, kidx) => (
                                  <div
                                    key={kidx}
                                    className="text-sm text-gray-600 truncate flex items-center gap-2"
                                  >
                                    <TrendingUp className="h-3 w-3 text-green-600 flex-shrink-0" />
                                    {typeof kw === 'string' ? kw : kw.keyword || JSON.stringify(kw)}
                                  </div>
                                ))}
                              </div>
                              {platform.count > 3 && (
                                <p className="text-xs text-gray-500 mt-2">
                                  +{platform.count - 3} more
                                </p>
                              )}
                            </>
                          ) : (
                            <p className="text-sm text-gray-500">
                              Keywords containing {platform.platform}-related terms
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!results && !loading && (
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Search className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Start Your Keyword Research
              </h3>
              <p className="text-gray-600 text-center max-w-md">
                Enter a seed keyword above to discover hundreds of related keywords,
                questions, and trending topics across all major platforms.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
