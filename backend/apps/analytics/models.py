from django.db import models
from django.conf import settings
import uuid


class PlatformAnalytics(models.Model):
    """Platform-specific analytics data"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    platform_content = models.ForeignKey('content.PlatformContent', on_delete=models.CASCADE, related_name='analytics')
    
    platform = models.CharField(max_length=50)
    metric_type = models.CharField(max_length=100)  # e.g., "likes", "comments", "shares", "views"
    metric_value = models.IntegerField(default=0)
    metric_data = models.JSONField(default=dict, blank=True)  # Additional metric details
    
    recorded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'platform_analytics'
        ordering = ['-recorded_at']
        indexes = [
            models.Index(fields=['platform_content', '-recorded_at']),
            models.Index(fields=['platform', 'metric_type']),
        ]
    
    def __str__(self):
        return f"{self.platform} - {self.metric_type}: {self.metric_value}"


class PlatformConnection(models.Model):
    """User's connected social media accounts"""
    
    PLATFORM_CHOICES = [
        ('instagram', 'Instagram'),
        ('tiktok', 'TikTok'),
        ('linkedin', 'LinkedIn'),
        ('twitter', 'Twitter/X'),
        ('facebook', 'Facebook'),
        ('youtube', 'YouTube'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='platform_connections')
    
    platform = models.CharField(max_length=50, choices=PLATFORM_CHOICES)
    
    # OAuth tokens
    access_token = models.TextField(blank=True)
    refresh_token = models.TextField(blank=True)
    token_expires_at = models.DateTimeField(null=True, blank=True)
    
    # Platform user info
    platform_user_id = models.CharField(max_length=255, blank=True)
    platform_username = models.CharField(max_length=255, blank=True)
    platform_data = models.JSONField(default=dict, blank=True)
    
    is_active = models.BooleanField(default=True)
    connected_at = models.DateTimeField(auto_now_add=True)
    last_synced_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'platform_connections'
        unique_together = ['user', 'platform']
        indexes = [
            models.Index(fields=['user', 'platform']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.platform}"
