from django.db import models
from django.conf import settings
import uuid


class KeywordResearch(models.Model):
    """Keyword research data"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='keyword_research')
    
    keyword = models.CharField(max_length=255)
    country = models.CharField(max_length=10, default='us')
    language = models.CharField(max_length=10, default='en')
    
    # Search data
    search_volume = models.IntegerField(null=True, blank=True)
    trend_direction = models.CharField(max_length=20, blank=True)
    
    # JSON fields for structured data
    platform_breakdown = models.JSONField(default=dict, blank=True)
    questions = models.JSONField(default=list, blank=True)
    prepositions = models.JSONField(default=list, blank=True)
    alphabetical = models.JSONField(default=list, blank=True)
    comparisons = models.JSONField(default=list, blank=True)
    related_keywords = models.JSONField(default=list, blank=True)
    viral_examples = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'keyword_research'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['keyword']),
            models.Index(fields=['user', 'keyword']),
        ]
    
    def __str__(self):
        return f"{self.keyword} ({self.user.email})"
