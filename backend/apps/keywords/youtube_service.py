from googleapiclient.discovery import build
from django.conf import settings
import logging
from typing import Dict, List

logger = logging.getLogger(__name__)


class YouTubeResearchService:
    """Service for YouTube keyword research and video statistics"""
    
    def __init__(self, api_key: str = None):
        # Use YouTube API key from settings, or None if not configured
        self.api_key = api_key or getattr(settings, 'YOUTUBE_API_KEY', None)
        
        if not self.api_key:
            logger.warning("YouTube API key not configured. YouTube data will not be available.")
            self.youtube = None
            return
        
        try:
            self.youtube = build('youtube', 'v3', developerKey=self.api_key)
        except Exception as e:
            logger.error(f"Failed to initialize YouTube API: {str(e)}")
            self.youtube = None
    
    def get_keyword_data(self, keyword: str, max_results: int = 50) -> Dict:
        """
        Get comprehensive YouTube data for a keyword
        
        Returns:
        - video_count: Number of videos found
        - total_views: Total views across all videos
        - avg_views: Average views per video
        - total_likes: Total likes
        - total_comments: Total comments
        - top_videos: List of top performing videos
        """
        if not self.youtube:
            return self._empty_response(keyword)
        
        try:
            # Search for videos
            search_response = self.youtube.search().list(
                q=keyword,
                part='id,snippet',
                maxResults=max_results,
                type='video',
                order='relevance',
                relevanceLanguage='en'
            ).execute()
            
            if not search_response.get('items'):
                return self._empty_response(keyword)
            
            # Extract video IDs
            video_ids = [
                item['id']['videoId'] 
                for item in search_response['items']
                if item['id']['kind'] == 'youtube#video'
            ]
            
            if not video_ids:
                return self._empty_response(keyword)
            
            # Get detailed statistics for videos
            stats_response = self.youtube.videos().list(
                part='statistics,snippet',
                id=','.join(video_ids)
            ).execute()
            
            # Calculate aggregated statistics
            total_views = 0
            total_likes = 0
            total_comments = 0
            top_videos = []
            
            for video in stats_response.get('items', []):
                stats = video.get('statistics', {})
                snippet = video.get('snippet', {})
                
                views = int(stats.get('viewCount', 0))
                likes = int(stats.get('likeCount', 0))
                comments = int(stats.get('commentCount', 0))
                
                total_views += views
                total_likes += likes
                total_comments += comments
                
                top_videos.append({
                    'video_id': video['id'],
                    'title': snippet.get('title', ''),
                    'channel': snippet.get('channelTitle', ''),
                    'published_at': snippet.get('publishedAt', ''),
                    'thumbnail': snippet.get('thumbnails', {}).get('medium', {}).get('url', ''),
                    'views': views,
                    'likes': likes,
                    'comments': comments,
                    'engagement_rate': round((likes / views * 100), 2) if views > 0 else 0
                })
            
            # Sort by views
            top_videos.sort(key=lambda x: x['views'], reverse=True)
            
            video_count = len(video_ids)
            avg_views = total_views // video_count if video_count > 0 else 0
            
            return {
                'keyword': keyword,
                'platform': 'youtube',
                'video_count': video_count,
                'total_views': total_views,
                'avg_views': avg_views,
                'total_likes': total_likes,
                'total_comments': total_comments,
                'engagement_rate': round((total_likes / total_views * 100), 2) if total_views > 0 else 0,
                'top_videos': top_videos[:10],  # Return top 10
                'estimated_monthly_searches': self._estimate_searches(avg_views),
                'competition_level': self._calculate_competition(video_count, avg_views)
            }
            
        except Exception as e:
            logger.error(f"Error fetching YouTube data for '{keyword}': {str(e)}")
            return self._empty_response(keyword)
    
    def _estimate_searches(self, avg_views: int) -> str:
        """Estimate monthly searches based on average views"""
        if avg_views >= 1000000:
            return "1M+"
        elif avg_views >= 500000:
            return "500K-1M"
        elif avg_views >= 100000:
            return "100K-500K"
        elif avg_views >= 50000:
            return "50K-100K"
        elif avg_views >= 10000:
            return "10K-50K"
        elif avg_views >= 5000:
            return "5K-10K"
        elif avg_views >= 1000:
            return "1K-5K"
        else:
            return "<1K"
    
    def _calculate_competition(self, video_count: int, avg_views: int) -> str:
        """Calculate competition level"""
        if video_count > 10000 and avg_views > 100000:
            return "Very High"
        elif video_count > 5000 and avg_views > 50000:
            return "High"
        elif video_count > 1000 and avg_views > 10000:
            return "Medium"
        elif video_count > 500:
            return "Low"
        else:
            return "Very Low"
    
    def _empty_response(self, keyword: str) -> Dict:
        """Return empty response structure"""
        return {
            'keyword': keyword,
            'platform': 'youtube',
            'video_count': 0,
            'total_views': 0,
            'avg_views': 0,
            'total_likes': 0,
            'total_comments': 0,
            'engagement_rate': 0,
            'top_videos': [],
            'estimated_monthly_searches': '<1K',
            'competition_level': 'Unknown'
        }
    
    def get_trending_topics(self, region_code: str = 'US', max_results: int = 20) -> List[Dict]:
        """Get trending videos/topics for a region"""
        if not self.youtube:
            return []
        
        try:
            response = self.youtube.videos().list(
                part='snippet,statistics',
                chart='mostPopular',
                regionCode=region_code,
                maxResults=max_results
            ).execute()
            
            trending = []
            for video in response.get('items', []):
                snippet = video.get('snippet', {})
                stats = video.get('statistics', {})
                
                trending.append({
                    'video_id': video['id'],
                    'title': snippet.get('title', ''),
                    'channel': snippet.get('channelTitle', ''),
                    'category': snippet.get('categoryId', ''),
                    'views': int(stats.get('viewCount', 0)),
                    'likes': int(stats.get('likeCount', 0)),
                    'thumbnail': snippet.get('thumbnails', {}).get('medium', {}).get('url', '')
                })
            
            return trending
            
        except Exception as e:
            logger.error(f"Error fetching trending topics: {str(e)}")
            return []
