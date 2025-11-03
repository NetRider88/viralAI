import requests
from typing import Dict, List
import logging
import os
from django.conf import settings

logger = logging.getLogger(__name__)


class SerpApiTrendingService:
    """Service for fetching trending searches using SerpApi Google Trends"""
    
    SERPAPI_BASE_URL = "https://serpapi.com/search.json"
    
    # Niche categories with seed keywords
    NICHES = {
        'technology': ['AI', 'tech', 'software', 'gadgets', 'apps'],
        'health': ['fitness', 'health', 'wellness', 'nutrition', 'workout'],
        'business': ['business', 'startup', 'entrepreneur', 'marketing', 'sales'],
        'finance': ['crypto', 'stocks', 'investing', 'money', 'finance'],
        'lifestyle': ['lifestyle', 'fashion', 'beauty', 'travel', 'food'],
        'entertainment': ['movies', 'music', 'gaming', 'celebrities', 'tv shows'],
        'education': ['learning', 'courses', 'education', 'skills', 'training'],
        'sports': ['sports', 'football', 'basketball', 'fitness', 'athletics'],
        'news': ['news', 'politics', 'world', 'breaking', 'current events'],
        'ecommerce': ['shopping', 'deals', 'products', 'reviews', 'ecommerce']
    }
    
    def __init__(self):
        self.api_key = os.getenv('SERPAPI_KEY', settings.SERPAPI_KEY if hasattr(settings, 'SERPAPI_KEY') else None)
        if not self.api_key:
            logger.warning("SerpApi key not configured. Trending searches will not work.")
    
    def get_trending_now(self, geo: str = 'US', frequency: str = 'daily') -> Dict:
        """
        Get trending searches right now from Google Trends
        
        Args:
            geo: Country code (US, UK, CA, etc.)
            frequency: Not used anymore (kept for compatibility)
        
        Returns:
            Dict with trending searches data
        """
        if not self.api_key:
            return {
                'error': 'SerpApi key not configured',
                'trending_searches': []
            }
        
        try:
            # Use a broad popular keyword to get trending related searches
            # This gives us what's trending related to general topics
            trending_keywords = ['news', 'trending', 'viral', 'popular', 'latest']
            all_trending = []
            
            for keyword in trending_keywords[:1]:  # Use just 1 to save API calls and time
                params = {
                    'engine': 'google_trends',
                    'q': keyword,
                    'geo': geo,
                    'api_key': self.api_key
                }
            
                response = requests.get(
                    self.SERPAPI_BASE_URL,
                    params=params,
                    timeout=30  # Increased timeout
                )
                
                if response.status_code == 200:
                    data = response.json()
                    
                    # Try to get rising queries as trending
                    if 'related_queries' in data and 'rising' in data['related_queries']:
                        for item in data['related_queries']['rising'][:10]:  # Top 10 per keyword
                            query = item.get('query', '')
                            if query and query not in [t['query'] for t in all_trending]:
                                all_trending.append({
                                    'query': query,
                                    'traffic': f"+{item.get('value', 0)}%",
                                    'traffic_raw': item.get('extracted_value', 0),
                                    'image': '',
                                    'articles': []
                                })
                    
                    # If no rising queries, try top queries
                    elif 'related_queries' in data and 'top' in data['related_queries']:
                        for item in data['related_queries']['top'][:10]:
                            query = item.get('query', '')
                            if query and query not in [t['query'] for t in all_trending]:
                                all_trending.append({
                                    'query': query,
                                    'traffic': f"{item.get('value', 0)}",
                                    'traffic_raw': item.get('extracted_value', 0),
                                    'image': '',
                                    'articles': []
                                })
            
            # Return combined trending searches
            return {
                'geo': geo,
                'frequency': 'realtime',
                'trending_searches': all_trending[:20],  # Limit to 20
                'total_count': len(all_trending[:20])
            }
                
        except requests.exceptions.RequestException as e:
            logger.error(f"SerpApi request error: {str(e)}")
            return {
                'error': f'Request failed: {str(e)}',
                'trending_searches': []
            }
                
        except Exception as e:
            logger.error(f"Error fetching trending searches: {str(e)}")
            return {
                'error': str(e),
                'trending_searches': []
            }
    
    def get_interest_over_time(self, keyword: str, geo: str = 'US', timeframe: str = 'today 12-m') -> Dict:
        """
        Get interest over time for a specific keyword
        
        Args:
            keyword: Search term
            geo: Country code
            timeframe: Time range (e.g., 'today 12-m', 'today 3-m', 'now 7-d')
        
        Returns:
            Dict with interest over time data
        """
        if not self.api_key:
            return {
                'error': 'SerpApi key not configured',
                'timeline_data': []
            }
        
        try:
            params = {
                'engine': 'google_trends',
                'q': keyword,
                'geo': geo,
                'date': timeframe,
                'api_key': self.api_key
            }
            
            response = requests.get(
                self.SERPAPI_BASE_URL,
                params=params,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Extract interest over time
                timeline_data = []
                if 'interest_over_time' in data:
                    timeline = data['interest_over_time'].get('timeline_data', [])
                    for point in timeline:
                        timeline_data.append({
                            'date': point.get('date', ''),
                            'value': point.get('values', [{}])[0].get('value', 0)
                        })
                
                # Extract related queries
                related_queries = []
                if 'related_queries' in data:
                    for query in data['related_queries'].get('rising', [])[:10]:
                        related_queries.append({
                            'query': query.get('query', ''),
                            'value': query.get('value', 0)
                        })
                
                return {
                    'keyword': keyword,
                    'geo': geo,
                    'timeframe': timeframe,
                    'timeline_data': timeline_data,
                    'related_queries': related_queries
                }
            else:
                logger.error(f"SerpApi error: {response.status_code}")
                return {
                    'error': f'API returned status {response.status_code}',
                    'timeline_data': []
                }
                
        except Exception as e:
            logger.error(f"Error fetching interest over time: {str(e)}")
            return {
                'error': str(e),
                'timeline_data': []
            }
    
    def get_related_topics(self, keyword: str, geo: str = 'US') -> Dict:
        """
        Get related topics and queries for a keyword
        
        Args:
            keyword: Search term
            geo: Country code
        
        Returns:
            Dict with related topics and queries
        """
        if not self.api_key:
            return {
                'error': 'SerpApi key not configured',
                'related_topics': [],
                'related_queries': []
            }
        
        try:
            params = {
                'engine': 'google_trends',
                'q': keyword,
                'geo': geo,
                'api_key': self.api_key
            }
            
            response = requests.get(
                self.SERPAPI_BASE_URL,
                params=params,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Extract related topics
                related_topics = []
                if 'related_topics' in data:
                    for topic in data['related_topics'].get('rising', [])[:10]:
                        related_topics.append({
                            'topic': topic.get('topic', {}).get('title', ''),
                            'type': topic.get('topic', {}).get('type', ''),
                            'value': topic.get('value', 0)
                        })
                
                # Extract related queries
                related_queries = []
                if 'related_queries' in data:
                    for query in data['related_queries'].get('top', [])[:10]:
                        related_queries.append({
                            'query': query.get('query', ''),
                            'value': query.get('value', 0)
                        })
                
                return {
                    'keyword': keyword,
                    'geo': geo,
                    'related_topics': related_topics,
                    'related_queries': related_queries
                }
            else:
                logger.error(f"SerpApi error: {response.status_code}")
                return {
                    'error': f'API returned status {response.status_code}',
                    'related_topics': [],
                    'related_queries': []
                }
                
        except Exception as e:
            logger.error(f"Error fetching related topics: {str(e)}")
            return {
                'error': str(e),
                'related_topics': [],
                'related_queries': []
            }
    
    def get_niche_keywords(self, niche: str, geo: str = 'US', limit: int = 20) -> Dict:
        """
        Get top trending keywords for a specific niche
        
        Args:
            niche: Niche category (technology, health, business, etc.)
            geo: Country code
            limit: Maximum number of keywords to return
        
        Returns:
            Dict with niche keywords and trends
        """
        if not self.api_key:
            return {
                'error': 'SerpApi key not configured',
                'niche': niche,
                'keywords': []
            }
        
        if niche not in self.NICHES:
            return {
                'error': f'Invalid niche. Available: {", ".join(self.NICHES.keys())}',
                'niche': niche,
                'keywords': []
            }
        
        try:
            all_keywords = []
            seed_keywords = self.NICHES[niche]
            
            # Get trending keywords from the main seed keyword
            main_keyword = seed_keywords[0]
            
            params = {
                'engine': 'google_trends',
                'q': main_keyword,
                'geo': geo,
                'data_type': 'RELATED_QUERIES',  # Specifically request related queries
                'api_key': self.api_key
            }
            
            response = requests.get(
                self.SERPAPI_BASE_URL,
                params=params,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Get rising queries (trending up)
                if 'related_queries' in data and 'rising' in data['related_queries']:
                    for item in data['related_queries']['rising'][:limit]:
                        all_keywords.append({
                            'keyword': item.get('query', ''),
                            'trend': 'rising',
                            'value': item.get('value', 0),
                            'growth': f"+{item.get('value', 0)}%",
                            'popularity': 'high'
                        })
                
                # Get top queries if not enough rising
                if len(all_keywords) < limit and 'related_queries' in data and 'top' in data['related_queries']:
                    for item in data['related_queries']['top'][:limit - len(all_keywords)]:
                        keyword = item.get('query', '')
                        if keyword not in [k['keyword'] for k in all_keywords]:
                            all_keywords.append({
                                'keyword': keyword,
                                'trend': 'stable',
                                'value': item.get('value', 0),
                                'growth': f"{item.get('value', 0)}",
                                'popularity': 'medium' if item.get('value', 0) < 50 else 'high'
                            })
                
                return {
                    'niche': niche,
                    'geo': geo,
                    'seed_keyword': main_keyword,
                    'keywords': all_keywords[:limit],
                    'total_count': len(all_keywords[:limit])
                }
            else:
                logger.error(f"SerpApi error: {response.status_code}")
                return {
                    'error': f'API returned status {response.status_code}',
                    'niche': niche,
                    'keywords': []
                }
                
        except Exception as e:
            logger.error(f"Error fetching niche keywords: {str(e)}")
            return {
                'error': str(e),
                'niche': niche,
                'keywords': []
            }
    
    def get_available_niches(self) -> List[Dict]:
        """Get list of available niche categories"""
        return [
            {
                'id': niche_id,
                'name': niche_id.title(),
                'description': f'Trending keywords in {niche_id}',
                'seed_keywords': keywords[:3]  # Show first 3 as examples
            }
            for niche_id, keywords in self.NICHES.items()
        ]
