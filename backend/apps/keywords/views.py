from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import KeywordResearch
from .serializers import KeywordResearchSerializer, KeywordResearchCreateSerializer
from .services import KeywordResearchService
from .youtube_service import YouTubeResearchService
import logging

logger = logging.getLogger(__name__)


class KeywordResearchViewSet(viewsets.ModelViewSet):
    """API endpoint for keyword research"""
    
    serializer_class = KeywordResearchSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return keyword research for current user"""
        return KeywordResearch.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def research(self, request):
        """
        Perform keyword research
        
        POST /api/keywords/research/
        {
            "keyword": "AI tools",
            "country": "us",
            "language": "en"
        }
        """
        serializer = KeywordResearchCreateSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        keyword = serializer.validated_data['keyword']
        country = serializer.validated_data.get('country', 'us')
        language = serializer.validated_data.get('language', 'en')
        
        try:
            # Check if research already exists (within last 24 hours)
            existing = KeywordResearch.objects.filter(
                user=request.user,
                keyword__iexact=keyword,
                country=country,
                language=language,
                created_at__gte=timezone.now() - timezone.timedelta(days=1)
            ).first()
            
            if existing:
                logger.info(f"Returning cached keyword research for: {keyword}")
                return Response({
                    'cached': True,
                    'data': KeywordResearchSerializer(existing).data
                })
            
            # Perform new research
            logger.info(f"Performing new keyword research for: {keyword}")
            service = KeywordResearchService(keyword, country, language)
            research_data = service.perform_full_research()
            
            # Get YouTube data (optional - won't fail if API key missing)
            youtube_data = None
            try:
                youtube_service = YouTubeResearchService()
                youtube_data = youtube_service.get_keyword_data(keyword)
            except Exception as e:
                logger.warning(f"YouTube data unavailable: {str(e)}")
            
            # Save to database
            keyword_research = KeywordResearch.objects.create(
                user=request.user,
                keyword=keyword,
                country=country,
                language=language,
                search_volume=research_data['summary']['total_suggestions'],
                platform_breakdown=research_data['platform_breakdown'],
                questions=research_data['questions'],
                prepositions=research_data['prepositions'],
                alphabetical=research_data['alphabetical'],
                comparisons=research_data['comparisons'],
                related_keywords=research_data['related_keywords'],
                viral_examples=research_data['viral_examples'],
            )
            
            return Response({
                'cached': False,
                'data': KeywordResearchSerializer(keyword_research).data,
                'summary': research_data['summary'],
                'youtube': youtube_data  # Add YouTube data to response
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error performing keyword research: {str(e)}")
            return Response(
                {'error': 'Failed to perform keyword research', 'detail': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
