import requests
from typing import Dict, List
import logging

logger = logging.getLogger(__name__)


class KeywordResearchService:
    """Service for keyword research using Google Autocomplete API"""
    
    GOOGLE_AUTOCOMPLETE_URL = "http://suggestqueries.google.com/complete/search"
    
    # Question words for research
    QUESTIONS = ['what', 'how', 'why', 'where', 'when', 'who', 'which', 'are', 'can', 'will']
    
    # Prepositions for research
    PREPOSITIONS = ['for', 'with', 'without', 'to', 'near', 'like', 'versus', 'vs', 'and', 'or']
    
    # Alphabet for research
    ALPHABET = list('abcdefghijklmnopqrstuvwxyz')
    
    def __init__(self, keyword: str, country: str = 'us', language: str = 'en'):
        self.keyword = keyword
        self.country = country
        self.language = language
    
    def _estimate_volume(self, popularity_score: int) -> str:
        """Estimate search volume range based on popularity score"""
        if popularity_score >= 9:
            return "10K-100K"
        elif popularity_score >= 7:
            return "5K-10K"
        elif popularity_score >= 5:
            return "1K-5K"
        elif popularity_score >= 3:
            return "500-1K"
        else:
            return "100-500"
    
    def fetch_autocomplete(self, query: str) -> List[Dict]:
        """Fetch autocomplete suggestions from Google"""
        try:
            params = {
                'client': 'firefox',
                'q': query,
                'hl': self.language,
                'gl': self.country,
            }
            
            response = requests.get(
                self.GOOGLE_AUTOCOMPLETE_URL,
                params=params,
                timeout=5
            )
            
            if response.status_code == 200:
                data = response.json()
                # Google returns [query, [suggestions]]
                suggestions = data[1] if len(data) > 1 else []
                
                # Add popularity score based on position (1-10, higher is better)
                # Keywords appearing first are typically more popular
                scored_suggestions = []
                for idx, suggestion in enumerate(suggestions):
                    score = max(10 - idx, 1)  # First result gets 10, last gets 1
                    scored_suggestions.append({
                        'keyword': suggestion,
                        'popularity_score': score,
                        'estimated_volume': self._estimate_volume(score)
                    })
                
                return scored_suggestions
            
            return []
            
        except Exception as e:
            logger.error(f"Error fetching autocomplete for '{query}': {str(e)}")
            return []
    
    def research_questions(self) -> List[Dict]:
        """Research question-based queries"""
        results = []
        
        for question in self.QUESTIONS:
            query = f"{self.keyword} {question}"
            suggestions = self.fetch_autocomplete(query)
            
            if suggestions:
                results.append({
                    'category': question,
                    'query': query,
                    'suggestions': suggestions,
                    'count': len(suggestions)
                })
        
        return results
    
    def research_prepositions(self) -> List[Dict]:
        """Research preposition-based queries"""
        results = []
        
        for preposition in self.PREPOSITIONS:
            query = f"{self.keyword} {preposition}"
            suggestions = self.fetch_autocomplete(query)
            
            if suggestions:
                results.append({
                    'category': preposition,
                    'query': query,
                    'suggestions': suggestions,
                    'count': len(suggestions)
                })
        
        return results
    
    def research_alphabetical(self) -> List[Dict]:
        """Research alphabetical queries"""
        results = []
        
        for letter in self.ALPHABET:
            query = f"{self.keyword} {letter}"
            suggestions = self.fetch_autocomplete(query)
            
            if suggestions:
                results.append({
                    'category': letter,
                    'query': query,
                    'suggestions': suggestions,
                    'count': len(suggestions)
                })
        
        return results
    
    def research_comparisons(self) -> List[Dict]:
        """Research comparison queries"""
        comparison_terms = ['vs', 'versus', 'or', 'compared to', 'better than']
        results = []
        
        for term in comparison_terms:
            query = f"{self.keyword} {term}"
            suggestions = self.fetch_autocomplete(query)
            
            if suggestions:
                results.append({
                    'category': term,
                    'query': query,
                    'suggestions': suggestions,
                    'count': len(suggestions)
                })
        
        return results
    
    def calculate_platform_breakdown(self, all_suggestions: List[str]) -> Dict:
        """
        Calculate estimated platform breakdown based on keyword patterns
        This is a simplified version - in production, you'd use actual platform APIs
        """
        # Platform keywords that indicate where content performs well
        platform_indicators = {
            'instagram': ['photo', 'picture', 'image', 'aesthetic', 'feed', 'story', 'reel'],
            'tiktok': ['video', 'trend', 'viral', 'dance', 'challenge', 'sound'],
            'linkedin': ['professional', 'career', 'business', 'job', 'work', 'industry'],
            'twitter': ['news', 'update', 'tweet', 'thread', 'breaking'],
            'youtube': ['tutorial', 'how to', 'guide', 'review', 'watch'],
        }
        
        platform_scores = {platform: 0 for platform in platform_indicators.keys()}
        
        # Score each platform based on keyword matches
        for suggestion in all_suggestions:
            suggestion_lower = suggestion.lower()
            for platform, indicators in platform_indicators.items():
                for indicator in indicators:
                    if indicator in suggestion_lower:
                        platform_scores[platform] += 1
        
        # Calculate percentages
        total_score = sum(platform_scores.values()) or 1
        platform_breakdown = {
            platform: {
                'count': score,
                'percentage': round((score / total_score) * 100, 1)
            }
            for platform, score in platform_scores.items()
        }
        
        return platform_breakdown
    
    def get_related_keywords(self) -> List[str]:
        """Get related keywords"""
        # Fetch suggestions for the base keyword
        suggestions = self.fetch_autocomplete(self.keyword)
        
        # Also try with common modifiers
        modifiers = ['best', 'top', 'free', 'online', 'near me']
        for modifier in modifiers:
            query = f"{modifier} {self.keyword}"
            suggestions.extend(self.fetch_autocomplete(query))
        
        # Extract keyword strings from dict objects
        keyword_strings = []
        for suggestion in suggestions:
            if isinstance(suggestion, dict):
                keyword_strings.append(suggestion['keyword'])
            else:
                keyword_strings.append(suggestion)
        
        # Remove duplicates and the original keyword
        related = list(set(keyword_strings))
        if self.keyword in related:
            related.remove(self.keyword)
        
        return related[:20]  # Return top 20
    
    def perform_full_research(self) -> Dict:
        """Perform complete keyword research"""
        logger.info(f"Starting keyword research for: {self.keyword}")
        
        # Gather all data
        questions = self.research_questions()
        prepositions = self.research_prepositions()
        alphabetical = self.research_alphabetical()
        comparisons = self.research_comparisons()
        related_keywords = self.get_related_keywords()
        
        # Collect all suggestions for platform breakdown
        all_suggestions = []
        for category in [questions, prepositions, alphabetical, comparisons]:
            for item in category:
                # Extract keyword strings from dict objects
                for suggestion in item['suggestions']:
                    if isinstance(suggestion, dict):
                        all_suggestions.append(suggestion['keyword'])
                    else:
                        all_suggestions.append(suggestion)
        
        platform_breakdown = self.calculate_platform_breakdown(all_suggestions)
        
        # Calculate summary statistics
        total_suggestions = len(all_suggestions)
        
        result = {
            'keyword': self.keyword,
            'country': self.country,
            'language': self.language,
            'summary': {
                'total_suggestions': total_suggestions,
                'questions_count': len(questions),
                'prepositions_count': len(prepositions),
                'alphabetical_count': len(alphabetical),
                'comparisons_count': len(comparisons),
            },
            'platform_breakdown': platform_breakdown,
            'questions': questions,
            'prepositions': prepositions,
            'alphabetical': alphabetical,
            'comparisons': comparisons,
            'related_keywords': related_keywords,
            'viral_examples': [],  # Placeholder for now
        }
        
        logger.info(f"Keyword research completed: {total_suggestions} suggestions found")
        
        return result
