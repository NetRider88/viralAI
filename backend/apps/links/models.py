from django.db import models
from django.conf import settings
import uuid
import random
import string


def generate_short_code():
    """Generate a random 6-character short code"""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=6))


class TrackableLink(models.Model):
    """Short trackable links"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='trackable_links')
    content_block = models.ForeignKey('content.ContentBlock', on_delete=models.SET_NULL, null=True, blank=True)
    
    platform = models.CharField(max_length=50, blank=True)
    short_code = models.CharField(max_length=50, unique=True, default=generate_short_code)
    destination_url = models.URLField()
    custom_slug = models.CharField(max_length=255, blank=True)
    
    # Optional metadata
    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    campaign = models.CharField(max_length=100, blank=True)
    
    # Metrics
    clicks = models.IntegerField(default=0)
    unique_visitors = models.IntegerField(default=0)
    conversions = models.IntegerField(default=0)
    revenue = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'trackable_links'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['short_code']),
            models.Index(fields=['user', '-created_at']),
        ]
    
    def __str__(self):
        return f"viral.ai/{self.short_code}"
    
    @property
    def full_url(self):
        return f"https://viral.ai-it.io/{self.short_code}"


class LinkClick(models.Model):
    """Individual link click tracking"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    link = models.ForeignKey(TrackableLink, on_delete=models.CASCADE, related_name='clicks_detail')
    
    # Request data
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    referer = models.TextField(blank=True)
    
    # Geographic data
    country = models.CharField(max_length=10, blank=True)
    city = models.CharField(max_length=100, blank=True)
    region = models.CharField(max_length=100, blank=True)
    
    # Device data
    device_type = models.CharField(max_length=50, blank=True)  # mobile, desktop, tablet
    browser = models.CharField(max_length=100, blank=True)
    os = models.CharField(max_length=100, blank=True)
    
    is_unique = models.BooleanField(default=True)
    clicked_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'link_clicks'
        ordering = ['-clicked_at']
        indexes = [
            models.Index(fields=['link', '-clicked_at']),
            models.Index(fields=['country']),
        ]
    
    def __str__(self):
        return f"Click on {self.link.short_code} at {self.clicked_at}"
