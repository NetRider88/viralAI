from django.db import models
from django.conf import settings
import uuid


class ContentBlock(models.Model):
    """Main content block containing all platform versions"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='content_blocks')
    keyword = models.ForeignKey('keywords.KeywordResearch', on_delete=models.SET_NULL, null=True, blank=True)
    
    title = models.CharField(max_length=500)
    keyword_text = models.CharField(max_length=255, blank=True)
    niche = models.CharField(max_length=100, blank=True)
    content_angle = models.CharField(max_length=100, blank=True)
    tone = models.CharField(max_length=100, blank=True)
    
    status = models.CharField(
        max_length=50,
        choices=[
            ('draft', 'Draft'),
            ('published', 'Published'),
            ('archived', 'Archived'),
        ],
        default='draft'
    )
    
    # Performance metrics (aggregated from all platforms)
    total_reach = models.IntegerField(default=0)
    total_engagement = models.IntegerField(default=0)
    total_clicks = models.IntegerField(default=0)
    total_conversions = models.IntegerField(default=0)
    revenue_generated = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'content_blocks'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return self.title


class PlatformContent(models.Model):
    """Platform-specific content version"""
    
    PLATFORM_CHOICES = [
        ('instagram', 'Instagram'),
        ('tiktok', 'TikTok'),
        ('linkedin', 'LinkedIn'),
        ('twitter', 'Twitter/X'),
        ('facebook', 'Facebook'),
        ('youtube', 'YouTube'),
        ('blog', 'Blog'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    content_block = models.ForeignKey(ContentBlock, on_delete=models.CASCADE, related_name='platform_versions')
    
    platform = models.CharField(max_length=50, choices=PLATFORM_CHOICES)
    content_type = models.CharField(max_length=100, blank=True)  # e.g., "carousel", "reel", "thread"
    
    caption = models.TextField(blank=True)
    hashtags = models.JSONField(default=list, blank=True)
    content_data = models.JSONField(default=dict, blank=True)  # Platform-specific data
    
    # Media
    images = models.JSONField(default=list, blank=True)  # List of image URLs
    video_script = models.TextField(blank=True)
    video_url = models.URLField(blank=True, null=True)
    
    # Tracking
    trackable_link = models.CharField(max_length=500, blank=True)
    posted_at = models.DateTimeField(null=True, blank=True)
    
    # Performance metrics
    reach = models.IntegerField(default=0)
    engagement = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'platform_content'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['content_block', 'platform']),
            models.Index(fields=['platform']),
        ]
    
    def __str__(self):
        return f"{self.content_block.title} - {self.platform}"


class BrandKit(models.Model):
    """User's brand assets"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='brand_kits')
    
    name = models.CharField(max_length=255)
    logo_url = models.URLField(blank=True, null=True)
    colors = models.JSONField(default=dict, blank=True)  # {"primary": "#FF5733", ...}
    fonts = models.JSONField(default=dict, blank=True)  # {"heading": "Montserrat", ...}
    watermark_settings = models.JSONField(default=dict, blank=True)
    
    is_default = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'brand_kits'
    
    def __str__(self):
        return f"{self.user.email} - {self.name}"


class ImageLibrary(models.Model):
    """User's uploaded images"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='images')
    
    filename = models.CharField(max_length=500)
    file_url = models.URLField()
    file_size = models.IntegerField(null=True, blank=True)  # in bytes
    width = models.IntegerField(null=True, blank=True)
    height = models.IntegerField(null=True, blank=True)
    mime_type = models.CharField(max_length=100, blank=True)
    
    folder = models.CharField(max_length=255, blank=True)
    tags = models.JSONField(default=list, blank=True)
    is_ai_generated = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'image_library'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
        ]
    
    def __str__(self):
        return self.filename
