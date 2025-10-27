from rest_framework import serializers
from .models import KeywordResearch


class KeywordResearchSerializer(serializers.ModelSerializer):
    """Serializer for keyword research data"""
    
    class Meta:
        model = KeywordResearch
        fields = [
            'id',
            'keyword',
            'country',
            'language',
            'search_volume',
            'trend_direction',
            'platform_breakdown',
            'questions',
            'prepositions',
            'alphabetical',
            'comparisons',
            'related_keywords',
            'viral_examples',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class KeywordResearchCreateSerializer(serializers.Serializer):
    """Serializer for creating keyword research request"""
    
    keyword = serializers.CharField(max_length=255)
    country = serializers.CharField(max_length=10, default='us')
    language = serializers.CharField(max_length=10, default='en')
    
    def validate_keyword(self, value):
        """Validate keyword is not empty"""
        if not value.strip():
            raise serializers.ValidationError("Keyword cannot be empty")
        return value.strip()
